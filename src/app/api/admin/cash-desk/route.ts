import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth/jwt';
import { dbRepository } from '@/lib/db/repository-selector';
import { generateRegistrationId, generateSafeToken } from '@/lib/idGenerator';
import { calculateRegistrationPrice, OFFICIAL_EVENTS, INITIAL_PRICING_CONFIG } from '@/lib/constants';
import { CashRegistrationSchema } from '@/lib/validation';

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!['SUPER_ADMIN', 'ADMIN', 'CASH_ADMIN'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const myOnly = searchParams.get('myOnly') === 'true' || session.role === 'CASH_ADMIN';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Fetch all cash registrations
    const listResult = await dbRepository.listRegistrations({
      search,
      paymentMethod: 'CASH',
      page: 1,
      limit: 1000, // get all to compute accurate aggregations
    });

    const todayStr = new Date().toISOString().slice(0, 10);

    let totalCashAmount = 0;
    let totalCashCount = 0;
    let myCashAmount = 0;
    let myCashCount = 0;
    let todayCashAmount = 0;
    let todayCashCount = 0;

    const allCashItems = listResult.items;

    for (const item of allCashItems) {
      const amt = item.amount || 0;
      totalCashAmount += amt;
      totalCashCount += 1;

      const isMyCollection =
        item.collectedBy?.includes(session.email) ||
        item.collectedBy?.includes(session.fullName);

      if (isMyCollection) {
        myCashAmount += amt;
        myCashCount += 1;
      }

      if (item.registration.createdAt?.startsWith(todayStr)) {
        todayCashAmount += amt;
        todayCashCount += 1;
      }
    }

    // Filter if myOnly requested or if CASH_ADMIN only wants their own
    let filteredItems = allCashItems;
    if (myOnly && session.role === 'CASH_ADMIN') {
      filteredItems = allCashItems.filter(
        (item) =>
          item.collectedBy?.includes(session.email) ||
          item.collectedBy?.includes(session.fullName)
      );
    }

    const total = filteredItems.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginatedItems = filteredItems.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      success: true,
      stats: {
        totalCashAmount,
        totalCashCount,
        myCashAmount,
        myCashCount,
        todayCashAmount,
        todayCashCount,
      },
      items: paginatedItems,
      total,
      page,
      totalPages,
    });
  } catch (error: any) {
    console.error('Cash Desk GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching cash desk data' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!['SUPER_ADMIN', 'ADMIN', 'CASH_ADMIN'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    const parsed = CashRegistrationSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || 'Invalid registration form data';
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }

    const { selectedEventIds, primaryParticipant, teamName, teamMembers, cashTendered, notes } =
      parsed.data;

    // Calculate dynamic pricing
    const settings = await dbRepository.getSettings();
    let pricingConfig = settings.pricing as Record<string, unknown> | undefined;
    if (
      !pricingConfig ||
      typeof pricingConfig !== 'object' ||
      '1' in pricingConfig ||
      !('hackathon' in pricingConfig)
    ) {
      pricingConfig = INITIAL_PRICING_CONFIG;
    }

    const pricing = calculateRegistrationPrice(selectedEventIds, pricingConfig);
    if (!pricing.canProceed || pricing.amount === null) {
      return NextResponse.json(
        {
          success: false,
          error: pricing.notice || 'Pricing for this combination is currently unfinalized.',
        },
        { status: 400 }
      );
    }

    const hasTeamEvent = selectedEventIds.some((id) => {
      const ev = OFFICIAL_EVENTS.find((e) => e.id === id);
      return ev?.type === 'TEAM';
    });
    const allTeamEvents = selectedEventIds.every((id) => {
      const ev = OFFICIAL_EVENTS.find((e) => e.id === id);
      return ev?.type === 'TEAM';
    });

    const regType: 'TEAM' | 'INDIVIDUAL' | 'MIXED' = hasTeamEvent
      ? allTeamEvents
        ? 'TEAM'
        : 'MIXED'
      : 'INDIVIDUAL';

    const primaryTeamEventId = selectedEventIds.find((id) => {
      const ev = OFFICIAL_EVENTS.find((e) => e.id === id);
      return ev?.type === 'TEAM';
    });

    const eventNames = selectedEventIds
      .map((id) => OFFICIAL_EVENTS.find((e) => e.id === id)?.name || id)
      .join(', ');
    const teamSize = hasTeamEvent ? 1 + (teamMembers?.length || 0) : 1;

    // Generate unique ID and secure verification token
    const registrationId = generateRegistrationId();
    const safeToken = generateSafeToken(registrationId);
    const transactionId = `CASH-${Date.now().toString(36).toUpperCase()}`;

    // Create registration with immediate VERIFIED payment status
    await dbRepository.createRegistration({
      registration: {
        registrationId,
        eventIds: selectedEventIds,
        eventName: eventNames,
        type: regType,
        teamSize,
        totalAmount: pricing.amount,
        paymentStatus: 'VERIFIED',
      },
      primaryParticipant: {
        fullName: primaryParticipant.fullName,
        email: primaryParticipant.email,
        phone: primaryParticipant.phone,
        usn: primaryParticipant.usn,
        college: primaryParticipant.college,
        department: primaryParticipant.department,
        yearSemester: primaryParticipant.yearSemester,
        githubProfile: primaryParticipant.githubProfile || '',
        linkedinProfile: primaryParticipant.linkedinProfile || '',
      },
      teamName: hasTeamEvent && teamName ? teamName.trim() : undefined,
      teamEventId: hasTeamEvent ? primaryTeamEventId : undefined,
      teamMembers: hasTeamEvent && teamMembers && teamMembers.length > 0 ? teamMembers : undefined,
      payment: {
        amount: pricing.amount,
        transactionId,
        screenshotUrl: '',
        screenshotMime: 'text/plain',
        status: 'VERIFIED',
        paidTo: `Cash Desk (${session.fullName})`,
        paymentMethod: 'CASH',
        collectedBy: `${session.fullName} (${session.email})`,
        adminNote: `Physical cash received by ${session.fullName}. Tendered: ₹${
          cashTendered || pricing.amount
        }. Change given: ₹${
          cashTendered && cashTendered > pricing.amount ? cashTendered - pricing.amount : 0
        }.${notes ? ` Note: ${notes}` : ''}`,
        verifiedBy: session.email,
        verifiedAt: new Date().toISOString(),
      },
    });

    // Audit log
    dbRepository.addAuditLog({
      adminId: session.id,
      adminEmail: session.email,
      action: 'CASH_REGISTRATION_CREATED',
      resource: 'REGISTRATION',
      resourceId: registrationId,
      metadata: {
        amount: pricing.amount,
        cashTendered,
        candidate: primaryParticipant.fullName,
        usn: primaryParticipant.usn,
      },
    });

    // Return full pass data for instant rendering
    return NextResponse.json({
      success: true,
      registrationId,
      safeToken,
      amount: pricing.amount,
      changeToReturn: cashTendered && cashTendered > pricing.amount ? cashTendered - pricing.amount : 0,
      registration: {
        registrationId,
        eventIds: selectedEventIds,
        type: regType,
        totalAmount: pricing.amount,
        paymentStatus: 'VERIFIED',
        createdAt: new Date().toISOString(),
      },
      primaryParticipant,
      team: hasTeamEvent && teamName
        ? {
            teamName,
            members: [
              { fullName: primaryParticipant.fullName, usn: primaryParticipant.usn, isPrimary: true },
              ...(teamMembers || []).map((m) => ({
                fullName: m.fullName,
                usn: m.usn,
                isPrimary: false,
              })),
            ],
          }
        : null,
      payment: {
        transactionId,
        amount: pricing.amount,
        status: 'VERIFIED',
        collectedBy: session.fullName,
      },
      message: 'On-spot cash registration completed and pass generated successfully.',
    });
  } catch (error: any) {
    console.error('Cash Desk POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error processing cash registration' },
      { status: 500 }
    );
  }
}
