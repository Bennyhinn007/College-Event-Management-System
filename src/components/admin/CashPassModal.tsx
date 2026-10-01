'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import {
  Printer,
  X,
  CheckCircle2,
  Download,
  Smartphone,
  ExternalLink,
  PlusCircle,
  Copy,
  Check,
} from 'lucide-react';
import { OFFICIAL_EVENTS, EVENT_INFO } from '@/lib/constants';
import WhatsAppIcon from '@/components/public/WhatsAppIcon';

interface CashPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewRegistration?: () => void;
  data: {
    registrationId: string;
    safeToken?: string;
    amount: number;
    createdAt?: string;
    eventIds: string[];
    primaryParticipant: {
      fullName: string;
      email: string;
      phone: string;
      usn: string;
      college: string;
      department: string;
      yearSemester: string;
    };
    team?: {
      teamName: string;
      members: Array<{ fullName: string; usn: string; isPrimary?: boolean }>;
    } | null;
    payment?: {
      transactionId: string;
      amount: number;
      collectedBy?: string;
    } | null;
    changeToReturn?: number;
  } | null;
}

export default function CashPassModal({
  isOpen,
  onClose,
  onNewRegistration,
  data,
}: CashPassModalProps) {
  const [checkinQr, setCheckinQr] = useState<string>('');
  const [mobilePassQr, setMobilePassQr] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!data) return;

    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    // 1. Entry Attendance Verification QR (Scanned by desk organizers)
    const token = data.safeToken || data.registrationId;
    const verifyUrl = `${origin}/verify?token=${token}`;
    QRCode.toDataURL(verifyUrl, {
      width: 280,
      margin: 1.5,
      color: { dark: '#0f172a', light: '#ffffff' },
    }).then(setCheckinQr).catch(console.error);

    // 2. Direct Pass URL (Scanned by student's phone camera to open their pass on their own phone)
    const passUrl = `${origin}/register/confirmation/${data.registrationId}`;
    QRCode.toDataURL(passUrl, {
      width: 220,
      margin: 1.5,
      color: { dark: '#0f172a', light: '#ffffff' },
    }).then(setMobilePassQr).catch(console.error);
  }, [data]);

  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const passUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/register/confirmation/${data.registrationId}`
      : `/register/confirmation/${data.registrationId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(passUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { primaryParticipant, team, registrationId, eventIds, amount, changeToReturn } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Modal Top Control Bar (Screen Only) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Cash Registration Confirmed</span>
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              ID: {registrationId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Badge</span>
            </button>
            {onNewRegistration && (
              <button
                onClick={() => {
                  onClose();
                  onNewRegistration();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white transition-colors shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Next Student</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Change Return Banner (if student tendered extra cash) */}
        {typeof changeToReturn === 'number' && changeToReturn > 0 && (
          <div className="no-print bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center justify-between text-xs text-amber-900 font-bold">
            <span>💵 Cash Change Alert: Return ₹{changeToReturn} to the student!</span>
            <span className="text-[11px] text-amber-700 font-normal">
              Collected amount: ₹{amount}
            </span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Student Camera Capture Instructions */}
          <div className="no-print p-3 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-teal-950">
              <Smartphone className="w-5 h-5 text-teal-700 shrink-0" />
              <div>
                <strong className="block">Student Instructions:</strong>
                <span className="text-[11px] text-teal-800">
                  Student can take a photo of this screen OR scan the phone QR below to keep their digital pass.
                </span>
              </div>
            </div>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-teal-300 text-teal-900 text-xs font-bold hover:bg-teal-100 transition-colors shrink-0 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Copy Pass URL'}</span>
            </button>
          </div>

          {/* Official Pass Card (Printable) */}
          <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-md p-5 sm:p-7 space-y-5 print-badge relative overflow-hidden">
            {/* Header: Institution & Logo */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b-2 border-slate-200 gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-teal-50 border border-teal-200 shrink-0 shadow-2xs">
                  <Image
                    src="/logo-circle.png"
                    alt="Hacktober 2026 Logo"
                    width={56}
                    height={56}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-amber-950 bg-amber-400 border border-amber-500/80 px-2 py-0.5 rounded-full">
                      🏆 NATIONAL LEVEL EVENT
                    </span>
                    <span className="text-[9px] font-bold text-teal-800 uppercase tracking-wider">
                      On-Spot Accredited Pass
                    </span>
                  </div>
                  <h2 className="font-mokoto text-lg sm:text-xl text-slate-900 tracking-wider">
                    HACKTOBER 2026 PASS
                  </h2>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Guru Nanak Dev Engineering College, Bidar • {EVENT_INFO.department}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Registration ID
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-teal-700 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200 inline-block mt-0.5">
                  {registrationId}
                </span>
              </div>
            </div>

            {/* Candidate & QR Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Candidate Bio Column */}
              <div className="md:col-span-8 space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px]">
                      Participant Name
                    </span>
                    <strong className="text-base text-slate-900 block font-bold mt-0.5">
                      {primaryParticipant.fullName}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px]">
                      USN / Student ID
                    </span>
                    <strong className="text-base text-slate-900 block font-mono font-bold mt-0.5">
                      {primaryParticipant.usn}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px]">College</span>
                    <span className="text-slate-800 font-medium block mt-0.5">
                      {primaryParticipant.college}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px]">
                      Branch & Year
                    </span>
                    <span className="text-slate-800 font-medium block mt-0.5">
                      {primaryParticipant.department} • {primaryParticipant.yearSemester}
                    </span>
                  </div>
                </div>

                {team && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 font-semibold block text-[11px]">
                      Team Roster:
                    </span>
                    <strong className="text-slate-900 block text-xs">{team.teamName}</strong>
                    <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-slate-600">
                      {team.members.map((m, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px]"
                        >
                          {m.fullName} ({m.usn})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Event Badges */}
                <div>
                  <span className="text-slate-400 block font-semibold text-[11px] mb-1.5">
                    Registered Competitions ({eventIds.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {eventIds.map((id) => {
                      const ev = OFFICIAL_EVENTS.find((e) => e.id === id);
                      return (
                        <span
                          key={id}
                          className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold text-[11px] border border-slate-200"
                        >
                          {ev?.name || id}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Secure Entry QR Code Column */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                {checkinQr ? (
                  <img
                    src={checkinQr}
                    alt="Registration Check-in QR"
                    className="w-36 h-36 rounded-lg shadow-2xs border border-slate-200 bg-white p-1"
                  />
                ) : (
                  <div className="w-36 h-36 bg-slate-200 rounded-lg animate-pulse" />
                )}
                <span className="text-[10px] font-mono text-slate-600 mt-2 font-bold block">
                  CHECK-IN QR PASS
                </span>
                <span className="text-[9px] text-slate-400">Scan at Entry Desk on Event Day</span>
              </div>
            </div>

            {/* Payment & Attendance Footer */}
            <div className="pt-3.5 border-t-2 border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Amount Received
                </span>
                <strong className="text-slate-900 font-mono text-sm">
                  ₹{amount}
                </strong>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Payment Status
                </span>
                <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  VERIFIED (CASH)
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Event Dates
                </span>
                <span className="text-slate-700 font-medium">29, 30 & 31 Oct 2026</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Desk Verification
                </span>
                <span className="text-slate-700 font-medium truncate block">
                  {data.payment?.collectedBy || 'Cash Desk'}
                </span>
              </div>
            </div>

            {/* Disclaimers */}
            <div className="text-[9px] text-slate-400 leading-tight pt-2 border-t border-slate-100 text-center">
              Official Hacktober 2026 Accreditation. Carry College ID Card. Guru Nanak Dev Engineering College, Bidar.
            </div>
          </div>

          {/* Student Phone Sync QR (Screen Only) */}
          <div className="no-print p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4 text-xs">
            {mobilePassQr ? (
              <img
                src={mobilePassQr}
                alt="Open Pass on Phone"
                className="w-24 h-24 rounded-xl border border-slate-300 bg-white p-1 shrink-0"
              />
            ) : (
              <div className="w-24 h-24 bg-slate-200 rounded-xl animate-pulse shrink-0" />
            )}
            <div className="space-y-1 text-center sm:text-left">
              <span className="font-bold text-slate-900 text-sm block">
                📲 Scan with Student Phone Camera
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Scan this QR code with any mobile camera (iPhone / Android) to directly open and save the official badge in the student&apos;s phone browser.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href={passUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-teal-700 hover:text-teal-900 font-bold"
                >
                  <span>Preview Public Pass URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-slate-300">•</span>
                <a
                  href={EVENT_INFO.whatsappCommunityLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-2xs transition-colors"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                  <span>Join Official WhatsApp Group</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="no-print bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            Close Window
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Badge</span>
            </button>
            {onNewRegistration && (
              <button
                onClick={() => {
                  onClose();
                  onNewRegistration();
                }}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Register Next Student</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
