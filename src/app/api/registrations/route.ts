import { NextRequest, NextResponse } from 'next/server';
import { RegistrationWizardSchema } from '@/lib/validation';
import { dbRepository } from '@/lib/db/repository-selector';
import { generateRegistrationId, generateSafeToken } from '@/lib/idGenerator';
import { calculateRegistrationPrice, OFFICIAL_EVENTS, INITIAL_PRICING_CONFIG } from '@/lib/constants';
import { uploadPaymentScreenshot } from '@/lib/storage/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate using Zod schema
    const parsed = RegistrationWizardSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || 'Invalid registration form data';
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }

    const {
      selectedEventIds,
      primaryParticipant,
      teamName,
      teamMembers,
      transactionId,
      paidTo,
      screenshotData,
      screenshotName,
    } = parsed.data;

    // Calculate dynamic pricing from repository settings
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

    // Determine event types and team details
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

    // Generate unique non-sequential ID
    const registrationId = generateRegistrationId();
    const safeToken = generateSafeToken(registrationId);

    // Upload payment proof screenshot exclusively to Cloudinary (zero fallback to database/base64)
    let uploadedScreenshot;
    try {
      uploadedScreenshot = await uploadPaymentScreenshot(screenshotData, registrationId, screenshotName);
    } catch (uploadError: unknown) {
      const uploadErrMsg =
        uploadError instanceof Error ? uploadError.message : 'Payment screenshot upload failed.';
      console.error('[Registration API] Cloudinary upload rejected registration:', uploadErrMsg);
      return NextResponse.json(
        {
          success: false,
          error: uploadErrMsg,
        },
        { status: 502 }
      );
    }

    // Save to database repository with Cloudinary metadata and strictly PENDING payment status
    await dbRepository.createRegistration({
      registration: {
        registrationId,
        eventIds: selectedEventIds,
        eventName: eventNames,
        type: regType,
        teamSize,
        totalAmount: pricing.amount,
        paymentStatus: 'PENDING',
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
        transactionId: transactionId.trim().toUpperCase(),
        screenshotUrl: uploadedScreenshot.secureUrl, // Cloudinary secure CDN URL
        screenshotMime: uploadedScreenshot.mimeType,
        cloudinaryPublicId: uploadedScreenshot.cloudinaryPublicId,
        originalFilename: uploadedScreenshot.originalFilename,
        fileSize: uploadedScreenshot.fileSize,
        uploadedAt: uploadedScreenshot.uploadedAt,
        status: 'PENDING',
        paidTo: paidTo || undefined,
        adminNote: paidTo ? `Paid to Coordinator: ${paidTo}` : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      registrationId,
      safeToken,
      amount: pricing.amount,
      paymentStatus: 'PENDING',
      message: 'Registration submitted successfully. Payment verification is pending organizer approval.',
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Internal server error processing registration.';
    console.error('Registration API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
