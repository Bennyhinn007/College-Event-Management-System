'use client';

import Link from 'next/link';
import {
  Terminal,
  Bug,
  MessageSquareText,
  Briefcase,
  ShieldAlert,
  Code,
  Cpu,
  Video,
  Palette,
  BrainCircuit,
  Clock,
  Sparkles,
  Users,
  User,
  ArrowRight,
  CreditCard,
  Trophy,
} from 'lucide-react';
import { OFFICIAL_EVENTS, EventDefinition } from '@/lib/constants';

const ICON_MAP: Record<string, React.ReactNode> = {
  Terminal: <Terminal className="w-6 h-6 text-emerald-600" />,
  Bug: <Bug className="w-6 h-6 text-rose-600" />,
  MessageSquareText: <MessageSquareText className="w-6 h-6 text-blue-600" />,
  Briefcase: <Briefcase className="w-6 h-6 text-amber-600" />,
  ShieldAlert: <ShieldAlert className="w-6 h-6 text-indigo-600" />,
  Code: <Code className="w-6 h-6 text-teal-600" />,
  Cpu: <Cpu className="w-6 h-6 text-violet-600" />,
  Video: <Video className="w-6 h-6 text-pink-600" />,
  Palette: <Palette className="w-6 h-6 text-orange-600" />,
  BrainCircuit: <BrainCircuit className="w-6 h-6 text-cyan-600" />,
};

interface EventCardsProps {
  initialPricing?: Record<string, unknown>;
}

export default function EventCards({ initialPricing }: EventCardsProps = {}) {
  const individualCount = OFFICIAL_EVENTS.filter((e) => e.type === 'INDIVIDUAL').length;
  const teamCount = OFFICIAL_EVENTS.filter((e) => e.type === 'TEAM').length;

  return (
    <section id="events" className="py-16 lg:py-24 bg-slate-50/80 border-b border-slate-200 relative bg-cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold uppercase tracking-wider mb-3">
            <span>10 Official Competitions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Challenge Your Technical Intellect
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Official competitions for Hacktober 2026 at Guru Nanak Dev Engineering College, Bidar (29, 30 & 31 October 2026).
          </p>

          {/* Category Summary Pill */}
          <div className="mt-6 p-3 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-700 cyber-corner">
            <span className="text-slate-500 font-medium">Competition Formats:</span>
            <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-900 border border-slate-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-600" />
              <span>{individualCount} Individual Events (1 Participant)</span>
            </span>
            <span className="px-3 py-1 rounded-md bg-teal-50 text-teal-900 border border-teal-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-teal-700" />
              <span>{teamCount} Team Events (Up to 4 Members)</span>
            </span>
          </div>
        </div>

        {/* Prominent Winners & Prizes Banner */}
        <div className="mb-10 sm:mb-12 p-4 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-orange-300/80 shadow-sm relative overflow-hidden cyber-corner text-center sm:text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 flex items-center justify-center text-white shadow-md shrink-0">
                <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-amber-50" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-100 text-orange-950 border border-orange-300/80 text-xs font-black uppercase tracking-wider">
                  <span>Grand Prize Pool</span>
                </div>
                <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center sm:justify-start gap-2">
                  <span>🏆 Exciting Prizes Await!</span>
                </h3>
                <p className="text-xs sm:text-base font-bold text-slate-800 max-w-2xl">
                  Winners of the Hacktober 2026 events can win exciting cash prizes and gadgets worth up to ₹15,000!
                </p>
              </div>
            </div>
            <div className="shrink-0 text-center sm:text-right">
              <span className="block text-[11px] font-mono font-bold text-orange-800 uppercase tracking-widest">
                PRIZES & GADGETS
              </span>
              <span className="text-2xl sm:text-4xl font-black font-mono text-slate-900 drop-shadow-xs">
                UP TO ₹15,000
              </span>
            </div>
          </div>
        </div>

        {/* 10 Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {OFFICIAL_EVENTS.map((event, idx) => {
            const isTeam = event.type === 'TEAM';
            return (
              <div
                key={event.id}
                className="group rounded-2xl bg-white border border-slate-200/90 p-4 sm:p-7 shadow-xs card-hover flex flex-col justify-between relative overflow-hidden cyber-corner"
              >
                {/* Top Accent Line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    isTeam ? 'bg-gradient-to-r from-teal-500 to-indigo-500' : 'bg-slate-900'
                  }`}
                />

                <div className="space-y-4">
                  {/* Icon & Participation Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      {ICON_MAP[event.icon] || <BrainCircuit className="w-6 h-6 text-teal-600" />}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title & Event Type Badge */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {event.name}
                    </h3>
                    <div className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                      {event.eventType}
                    </div>
                  </div>

                  {/* Event Metadata (Duration, Format, Team Size, Registration Fee) */}
                  <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                    {/* Duration if applicable */}
                    {event.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                        <span className="font-medium text-slate-700">⏱️ {event.duration}</span>
                      </div>
                    )}

                    {/* Format if applicable */}
                    {event.format && (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="font-medium text-slate-700">📋 {event.format}</span>
                      </div>
                    )}

                    {/* Participation Type */}
                    <div className="flex items-center gap-2">
                      {isTeam ? (
                        <>
                          <Users className="w-4 h-4 text-teal-600 shrink-0" />
                          <span className="font-semibold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                            👥 Team of 4
                          </span>
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4 text-slate-600 shrink-0" />
                          <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            👤 Individual
                          </span>
                        </>
                      )}
                    </div>

                    {/* Registration Fee */}
                    <div className="flex items-center gap-2 pt-1">
                      <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-sm font-extrabold text-slate-900 font-mono">
                        💰 {event.feeDisplay}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Button: Register Now */}
                <div className="pt-6 mt-4 border-t border-slate-100">
                  <Link
                    href={`/register?event=${event.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-xs group-hover:shadow"
                  >
                    <span>Register Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
