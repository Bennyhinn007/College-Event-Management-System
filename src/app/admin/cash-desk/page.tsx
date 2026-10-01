'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import {
  Banknote,
  Users,
  Search,
  RefreshCw,
  QrCode,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  PlusCircle,
  Smartphone,
  Trophy,
  Loader2,
  Trash2,
  Calendar,
  Building,
  Check,
  ChevronRight,
  UserCheck,
  Eye,
  Info,
} from 'lucide-react';
import {
  OFFICIAL_EVENTS,
  ALLOWED_SEMESTERS,
  calculateRegistrationPrice,
  INITIAL_PRICING_CONFIG,
} from '@/lib/constants';
import CashPassModal from '@/components/admin/CashPassModal';
import type { AdminPayload } from '@/lib/auth/jwt';

interface CashItem {
  registration: {
    registrationId: string;
    eventIds: string[];
    eventName?: string;
    type: string;
    totalAmount: number;
    paymentStatus: string;
    attendanceStatus: string;
    createdAt: string;
  };
  primaryParticipant: {
    fullName: string;
    email: string;
    phone: string;
    usn: string;
    college: string;
    department: string;
    yearSemester: string;
  } | null;
  teamName?: string;
  paymentStatus: string;
  paymentMethod?: string;
  collectedBy?: string;
  paidTo?: string;
  transactionId?: string;
  amount: number;
}

interface CashStats {
  totalCashAmount: number;
  totalCashCount: number;
  myCashAmount: number;
  myCashCount: number;
  todayCashAmount: number;
  todayCashCount: number;
}

export default function CashDeskPage() {
  const [admin, setAdmin] = useState<AdminPayload | null>(null);
  const [activeTab, setActiveTab] = useState<'REGISTER' | 'LEDGER'>('REGISTER');

  // Stats & Ledger state
  const [stats, setStats] = useState<CashStats>({
    totalCashAmount: 0,
    totalCashCount: 0,
    myCashAmount: 0,
    myCashCount: 0,
    todayCashAmount: 0,
    todayCashCount: 0,
  });
  const [cashList, setCashList] = useState<CashItem[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pricingConfig, setPricingConfig] = useState<Record<string, unknown>>(INITIAL_PRICING_CONFIG);

  // Form State
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [usn, setUsn] = useState('');
  const [isGndec, setIsGndec] = useState(true);
  const [customCollege, setCustomCollege] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [yearSemester, setYearSemester] = useState('5th Sem');

  // Team Details
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState<
    Array<{
      fullName: string;
      email: string;
      phone: string;
      usn: string;
      college: string;
      department: string;
      yearSemester: string;
    }>
  >([]);

  // Cash Tender State
  const [cashTendered, setCashTendered] = useState<string>('');
  const [deskNotes, setDeskNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any | null>(null);

  // Load current admin session & pricing config
  useEffect(() => {
    async function init() {
      try {
        const [meRes, settingsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/admin/settings'),
        ]);

        const meJson = await meRes.json();
        if (meJson.success) {
          setAdmin(meJson.user);
        }

        const settingsJson = await settingsRes.json();
        if (settingsJson.success && settingsJson.data?.pricing) {
          setPricingConfig(settingsJson.data.pricing);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      }
    }
    init();
  }, []);

  // Fetch Cash Ledger & Stats
  const fetchLedger = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await fetch(`/api/admin/cash-desk?search=${encodeURIComponent(searchQuery)}`);
      const json = await res.json();
      if (json.success) {
        setStats(json.stats);
        setCashList(json.items || []);
      }
    } catch (err) {
      console.error('Error fetching cash desk ledger:', err);
    } finally {
      setListLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  // Dynamic price calculation
  const pricing = useMemo(() => {
    return calculateRegistrationPrice(selectedEventIds, pricingConfig);
  }, [selectedEventIds, pricingConfig]);

  // Check if team events are selected
  const hasTeamEvent = useMemo(() => {
    return selectedEventIds.some((id) => {
      const ev = OFFICIAL_EVENTS.find((e) => e.id === id);
      return ev?.type === 'TEAM';
    });
  }, [selectedEventIds]);

  // Cash change calculation
  const cashChange = useMemo(() => {
    const tendered = parseFloat(cashTendered);
    if (isNaN(tendered) || !pricing.amount) return 0;
    return Math.max(0, tendered - pricing.amount);
  }, [cashTendered, pricing.amount]);

  const collegeName = isGndec ? 'Guru Nanak Dev Engineering College, Bidar' : customCollege.trim();

  // Handle Event Toggle
  const toggleEvent = (eventId: string) => {
    setSelectedEventIds((prev) => {
      if (prev.includes(eventId)) {
        return prev.filter((id) => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  // Add Team Member
  const addTeamMember = () => {
    if (teamMembers.length >= 3) return;
    setTeamMembers((prev) => [
      ...prev,
      {
        fullName: '',
        email: '',
        phone: '',
        usn: '',
        college: collegeName,
        department: 'Computer Science & Engineering',
        yearSemester: '5th Sem',
      },
    ]);
  };

  // Remove Team Member
  const removeTeamMember = (index: number) => {
    setTeamMembers((prev) => prev.filter((_, i) => i !== index));
  };

  // Update Team Member Field
  const updateTeamMember = (index: number, field: string, value: string) => {
    setTeamMembers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Reset form for next student
  const handleResetForm = () => {
    setSelectedEventIds([]);
    setFullName('');
    setEmail('');
    setPhone('');
    setUsn('');
    setIsGndec(true);
    setCustomCollege('');
    setDepartment('Computer Science & Engineering');
    setYearSemester('5th Sem');
    setTeamName('');
    setTeamMembers([]);
    setCashTendered('');
    setDeskNotes('');
    setFormError(null);
  };

  // Submit Cash Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (selectedEventIds.length === 0) {
      setFormError('Please select at least one competition.');
      return;
    }

    if (!collegeName) {
      setFormError('College name is required.');
      return;
    }

    if (hasTeamEvent && !teamName.trim()) {
      setFormError('Team Name is required for team competitions.');
      return;
    }

    if (hasTeamEvent && teamMembers.some((m) => !m.fullName.trim() || !m.usn.trim())) {
      setFormError('Please provide both Full Name and USN for all team members.');
      return;
    }

    const tenderedNum = cashTendered ? parseFloat(cashTendered) : undefined;
    if (tenderedNum && pricing.amount && tenderedNum < pricing.amount) {
      setFormError(`Tendered amount (₹${tenderedNum}) cannot be less than registration fee (₹${pricing.amount}).`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/cash-desk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedEventIds,
          primaryParticipant: {
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            usn: usn.trim().toUpperCase(),
            college: collegeName,
            department,
            yearSemester,
          },
          teamName: hasTeamEvent ? teamName.trim() : undefined,
          teamMembers: hasTeamEvent && teamMembers.length > 0
            ? teamMembers.map((m) => ({
                fullName: m.fullName.trim(),
                email: m.email ? m.email.trim().toLowerCase() : `${m.usn.trim().toLowerCase()}@gndec.ac.in`,
                phone: m.phone.trim() || phone.trim(),
                usn: m.usn.trim().toUpperCase(),
                college: m.college || collegeName,
                department: m.department || department,
                yearSemester: m.yearSemester || yearSemester,
              }))
            : undefined,
          cashTendered: tenderedNum,
          notes: deskNotes.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to process cash registration');
      }

      // Open Modal with instant official pass
      setModalData({
        registrationId: json.registrationId,
        safeToken: json.safeToken,
        amount: json.amount,
        changeToReturn: json.changeToReturn,
        eventIds: selectedEventIds,
        primaryParticipant: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          usn: usn.trim().toUpperCase(),
          college: collegeName,
          department,
          yearSemester,
        },
        team: hasTeamEvent && teamName
          ? {
              teamName,
              members: [
                { fullName: fullName.trim(), usn: usn.trim().toUpperCase(), isPrimary: true },
                ...teamMembers.map((m) => ({ fullName: m.fullName, usn: m.usn, isPrimary: false })),
              ],
            }
          : null,
        payment: {
          transactionId: json.payment?.transactionId || 'CASH',
          amount: json.amount,
          collectedBy: admin?.fullName,
        },
      });

      setModalOpen(true);
      fetchLedger();
    } catch (err: any) {
      setFormError(err.message || 'Error processing registration');
    } finally {
      setSubmitting(false);
    }
  };

  // Re-open Pass Modal from table
  const handleInspectRow = async (item: CashItem) => {
    try {
      const res = await fetch(`/api/registrations/${item.registration.registrationId}`);
      const json = await res.json();
      if (json.success) {
        setModalData({
          registrationId: json.registration.registrationId,
          safeToken: json.safeToken,
          amount: json.registration.totalAmount,
          eventIds: json.registration.eventIds,
          primaryParticipant: json.primaryParticipant,
          team: json.team,
          payment: {
            transactionId: json.payment?.transactionId || 'CASH',
            amount: json.registration.totalAmount,
            collectedBy: item.collectedBy,
          },
        });
        setModalOpen(true);
      }
    } catch (err) {
      console.error('Error fetching pass details:', err);
    }
  };

  // Delete Cash Registration (Super Admin Only)
  const handleDeleteCashRegistration = async (regId: string, candidateName?: string) => {
    const confirmed = window.confirm(
      `⚠️ PERMANENT DELETE (SUPER ADMIN)\n\nAre you sure you want to permanently delete registration ${regId} (${
        candidateName || 'Candidate'
      })?\n\nThis will completely remove this cash registration record from the database and cash drawer balance. This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/registrations/${regId}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        fetchLedger();
      } else {
        alert(json.error || 'Failed to delete registration');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting registration');
    }
  };

  // Export Cash Register as CSV
  const handleExportCsv = () => {
    if (cashList.length === 0) return;

    const headers = [
      'Registration ID',
      'Candidate Name',
      'USN',
      'College',
      'Department',
      'Semester',
      'Phone',
      'Email',
      'Team Name',
      'Competitions',
      'Amount (INR)',
      'Payment Status',
      'Collected By',
      'Date & Time',
    ];

    const rows = cashList.map((item) => [
      `"${item.registration.registrationId}"`,
      `"${item.primaryParticipant?.fullName || ''}"`,
      `"${item.primaryParticipant?.usn || ''}"`,
      `"${item.primaryParticipant?.college || ''}"`,
      `"${item.primaryParticipant?.department || ''}"`,
      `"${item.primaryParticipant?.yearSemester || ''}"`,
      `"${item.primaryParticipant?.phone || ''}"`,
      `"${item.primaryParticipant?.email || ''}"`,
      `"${item.teamName || 'Individual'}"`,
      `"${(item.registration.eventIds || []).join(', ')}"`,
      item.amount,
      `"${item.paymentStatus}"`,
      `"${item.collectedBy || ''}"`,
      `"${new Date(item.registration.createdAt).toLocaleString()}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Hacktober2026_Cash_Register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Banknote className="w-3.5 h-3.5 text-emerald-700" />
              <span>Cash Registration Desk</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Guru Nanak Dev Engineering College, Bidar
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            On-Spot Cash Registration Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Collect physical cash, instantly verify admission, and issue official scannable badges.
          </p>
        </div>

        {/* Active Cash Officer Tag */}
        {admin && (
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-bold text-sm">
              {admin.fullName.charAt(0)}
            </div>
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Logged In Desk Admin
              </span>
              <strong className="text-slate-900 block font-bold leading-tight">
                {admin.fullName}
              </strong>
              <span className="text-[10px] text-teal-700 font-semibold font-mono">
                {admin.role}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cash Box Summary Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            My Cash in Hand
          </span>
          <div className="flex items-baseline justify-between">
            <strong className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
              ₹{stats.myCashAmount.toLocaleString()}
            </strong>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {stats.myCashCount} students
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            Physical cash collected by your account
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Cash Box (All Desks)
          </span>
          <div className="flex items-baseline justify-between">
            <strong className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              ₹{stats.totalCashAmount.toLocaleString()}
            </strong>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {stats.totalCashCount} total
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            Aggregate on-spot collections
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Today&apos;s Cash Intake
          </span>
          <div className="flex items-baseline justify-between">
            <strong className="text-2xl sm:text-3xl font-black text-teal-600 font-mono">
              ₹{stats.todayCashAmount.toLocaleString()}
            </strong>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
              {stats.todayCashCount} today
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            Recorded since 12:00 AM today
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Treasury Actions
            </span>
            <strong className="text-sm font-bold text-white block mt-0.5">
              Cash Handover & Audit
            </strong>
          </div>
          <button
            onClick={handleExportCsv}
            disabled={cashList.length === 0}
            className="mt-3 w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Download Treasury Sheet</span>
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('REGISTER')}
          className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'REGISTER'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Cash Registration Form</span>
        </button>

        <button
          onClick={() => setActiveTab('LEDGER')}
          className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'LEDGER'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Banknote className="w-4 h-4" />
          <span>Cash Ledger &amp; Registrations Log ({cashList.length})</span>
        </button>
      </div>

      {/* TAB 1: NEW CASH REGISTRATION FORM */}
      {activeTab === 'REGISTER' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Events & Participant Details */}
            <div className="lg:col-span-8 space-y-6">
              {/* Event Selection Panel */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                      1. Select Competitions *
                    </h3>
                    <p className="text-xs text-slate-500">
                      Multi-select supported. System applies auto-combo discounts.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                    {selectedEventIds.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {OFFICIAL_EVENTS.map((event) => {
                    const isSelected = selectedEventIds.includes(event.id);
                    return (
                      <div
                        key={event.id}
                        onClick={() => toggleEvent(event.id)}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900/5 shadow-xs'
                            : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-xs font-bold text-slate-900 block">
                              {event.name}
                            </strong>
                            <span
                              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                                event.type === 'TEAM'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {event.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{event.eventType}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'bg-white border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Primary Participant Information */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                      2. Participant Details *
                    </h3>
                    <p className="text-xs text-slate-500">
                      Candidate identity for pass generation.
                    </p>
                  </div>

                  {/* GNDEC Quick Toggle */}
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setIsGndec(true)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        isGndec ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      GNDEC Bidar
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsGndec(false)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        !isGndec ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Other College
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">USN / Student ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3GN23CS042"
                      value={usn}
                      onChange={(e) => setUsn(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. student@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  {!isGndec && (
                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-bold text-slate-700">College / University Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. BKIT Bhalki / PDA College Gulbarga"
                        value={customCollege}
                        onChange={(e) => setCustomCollege(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Department / Branch *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CSE / IoT & Cyber / AI / ECE"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Current Semester *</label>
                    <select
                      value={yearSemester}
                      onChange={(e) => setYearSemester(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                    >
                      {ALLOWED_SEMESTERS.map((sem) => (
                        <option key={sem} value={sem}>
                          {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Team Members Section (Conditional if Team Event selected) */}
              {hasTeamEvent && (
                <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-2xs p-6 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-purple-950 uppercase tracking-wide">
                        3. Team Roster (Team Competition Selected)
                      </h3>
                      <p className="text-xs text-purple-700">
                        {fullName || 'Leader'} is Team Leader. Add up to 3 additional members.
                      </p>
                    </div>

                    {teamMembers.length < 3 && (
                      <button
                        type="button"
                        onClick={addTeamMember}
                        className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add Member</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-700">Team Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cyber Ninjas"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs font-bold focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  {teamMembers.length > 0 && (
                    <div className="space-y-3 pt-2">
                      {teamMembers.map((member, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2 relative"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                            <span>Member #{idx + 2}</span>
                            <button
                              type="button"
                              onClick={() => removeTeamMember(idx)}
                              className="text-rose-600 hover:text-rose-800 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <input
                              type="text"
                              required
                              placeholder="Member Full Name *"
                              value={member.fullName}
                              onChange={(e) => updateTeamMember(idx, 'fullName', e.target.value)}
                              className="px-3 py-1.5 rounded-lg border border-purple-200 text-xs bg-white"
                            />
                            <input
                              type="text"
                              required
                              placeholder="Member USN *"
                              value={member.usn}
                              onChange={(e) =>
                                updateTeamMember(idx, 'usn', e.target.value.toUpperCase())
                              }
                              className="px-3 py-1.5 rounded-lg border border-purple-200 text-xs font-mono font-bold bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Dynamic Pricing & Cash Calculation Box */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-md p-6 space-y-5 sticky top-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                    Live Cash Registry
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Registration Fee Due
                  </h3>
                </div>

                {/* Amount Due Big Display */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white text-center space-y-1">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Amount to Collect
                  </span>
                  <strong className="text-4xl font-black font-mono text-emerald-400 block">
                    ₹{pricing.amount !== null ? pricing.amount : '--'}
                  </strong>
                  {pricing.notice && (
                    <span className="text-[11px] text-amber-300 font-medium block">
                      {pricing.notice}
                    </span>
                  )}
                </div>

                {/* Cash Tendered & Change Calculator */}
                <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">
                      Cash Note Handed by Student (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-400">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="e.g. 500"
                        value={cashTendered}
                        onChange={(e) => setCashTendered(e.target.value)}
                        className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  {/* Change Return Box */}
                  {cashChange > 0 && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-center justify-between animate-in zoom-in-95">
                      <span className="font-bold text-xs">Return Change to Student:</span>
                      <strong className="text-xl font-black font-mono text-amber-800">
                        ₹{cashChange}
                      </strong>
                    </div>
                  )}

                  {/* Desk Notes */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">
                      Internal Desk Note (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Counter A / Cash handed to Rahul"
                      value={deskNotes}
                      onChange={(e) => setDeskNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={submitting || selectedEventIds.length === 0 || !pricing.canProceed}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm tracking-wide transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying & Printing Pass...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Cash & Generate Pass</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                  Generates an instantly verified participant pass with scannable attendance QR code.
                </p>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: CASH DESK LEDGER & REGISTRATIONS LOG */}
      {activeTab === 'LEDGER' && (
        <div className="space-y-4">
          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute inset-y-0 left-3 my-auto pointer-events-none" />
              <input
                type="text"
                placeholder="Search by USN, Name, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={fetchLedger}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${listLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleExportCsv}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
            {listLoading ? (
              <div className="py-20 text-center space-y-2">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
                <span className="text-xs text-slate-500 font-semibold block">
                  Loading Cash Desk Records...
                </span>
              </div>
            ) : cashList.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <Banknote className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">No Cash Registrations Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Students registered via on-spot cash desk will appear here with instant pass previews.
                </p>
                <button
                  onClick={() => setActiveTab('REGISTER')}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-teal-700 transition-colors inline-flex items-center gap-1.5 mt-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Register First Student</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Registration ID</th>
                      <th className="py-3 px-4">Participant & USN</th>
                      <th className="py-3 px-4">Events</th>
                      <th className="py-3 px-4">Amount Paid</th>
                      <th className="py-3 px-4">Cash Received By</th>
                      <th className="py-3 px-4">Date / Time</th>
                      <th className="py-3 px-4 text-right">Pass Badge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cashList.map((item) => (
                      <tr key={item.registration.registrationId} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4 font-mono font-bold text-teal-700">
                          {item.registration.registrationId}
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="text-slate-900 block font-bold">
                            {item.primaryParticipant?.fullName || 'N/A'}
                          </strong>
                          <span className="font-mono text-[11px] text-slate-500">
                            {item.primaryParticipant?.usn}
                          </span>
                          {item.teamName && (
                            <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 inline-block mt-0.5 font-semibold">
                              Team: {item.teamName}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {(item.registration.eventIds || []).map((id) => {
                              const ev = OFFICIAL_EVENTS.find((e) => e.id === id);
                              return (
                                <span
                                  key={id}
                                  className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-semibold border border-slate-200"
                                >
                                  {ev?.name || id}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="text-slate-900 font-mono text-sm block">
                            ₹{item.amount}
                          </strong>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 inline-block mt-0.5">
                            CASH VERIFIED
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-slate-700 font-medium block">
                            {item.collectedBy || item.paidTo || 'Cash Desk'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                          {new Date(item.registration.createdAt).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleInspectRow(item)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-teal-700 transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Pass</span>
                            </button>
                            {admin?.role === 'SUPER_ADMIN' && (
                              <button
                                onClick={() =>
                                  handleDeleteCashRegistration(
                                    item.registration.registrationId,
                                    item.primaryParticipant?.fullName
                                  )
                                }
                                title="Permanently delete test registration (Super Admin)"
                                className="px-2 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors inline-flex items-center gap-1 font-semibold text-[11px]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Official Pass Card Modal */}
      <CashPassModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onNewRegistration={handleResetForm}
        data={modalData}
      />
    </div>
  );
}
