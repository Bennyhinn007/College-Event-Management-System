'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, ShieldCheck, Sparkles, Terminal, Trophy } from 'lucide-react';
import { EVENT_INFO } from '@/lib/constants';

import Image from 'next/image';
import WhatsAppIcon from './WhatsAppIcon';

interface HeroProps {
  initialEventInfo?: typeof EVENT_INFO;
}

export default function Hero({ initialEventInfo }: HeroProps = {}) {
  const [eventInfo, setEventInfo] = useState<typeof EVENT_INFO>(initialEventInfo || EVENT_INFO);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // If initialEventInfo was already provided by SSR/ISR, no need for redundant client fetch
    if (initialEventInfo) return;

    async function refreshSettings() {
      try {
        const res = await fetch('/api/settings');
        const json = await res.json();
        if (json.success && json.data?.eventInfo) {
          setEventInfo((prev) => ({ ...prev, ...json.data.eventInfo }));
        }
      } catch (e) {
        // Fallback to initial/constant
      }
    }
    refreshSettings();
  }, [initialEventInfo]);

  useEffect(() => {
    const targetDate = new Date(eventInfo.startDate || '2026-10-29T09:00:00+05:30').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [eventInfo.startDate]);

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200 py-12 lg:py-20 bg-grid-pattern">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/85 to-slate-50/60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Official Emblem Banner */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white border-2 border-teal-500/30 p-1 shadow-md hover:border-teal-500 transition-all hover:scale-105 duration-300">
                <Image
                  src="/logo-circle.png"
                  alt="Cyber Samurai Association - Hacktober 2026 Official Logo"
                  width={112}
                  height={112}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div className="absolute -inset-1 rounded-full bg-teal-400/10 blur-sm -z-10 group-hover:bg-teal-400/20 transition-all" />
            </div>

            {/* Institutional Header Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>Guru Nanak Dev Engineering College, Bidar</span>
              <span className="text-slate-300">•</span>
              <span className="text-teal-700 font-bold">Cyber Samurai Association</span>
            </div>

            {/* Motto */}
            <div className="text-[11px] font-mono tracking-widest text-teal-800 uppercase bg-teal-50 px-3 py-1 rounded-md border border-teal-200/60">
              ज्ञानं रक्षति सर्वदः • Knowledge Protects Always
            </div>
          </div>

          {/* Department */}
          <p className="text-xs sm:text-sm font-semibold text-slate-600 tracking-wider uppercase max-w-2xl mx-auto">
            {eventInfo.department}
          </p>

          {/* Master Title in Mokoto Font & Tagline */}
          <div className="space-y-4 pt-2">
            <h1 className="font-mokoto text-4xl sm:text-6xl lg:text-7xl tracking-wider text-slate-900 uppercase drop-shadow-xs">
              HACKTOBER <span className="text-teal-600">2026</span>
            </h1>

            {/* Visual Highlight: NATIONAL LEVEL EVENT & Cybersecurity Awareness Month */}
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 border-2 border-amber-500 shadow-md">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-950 shrink-0" />
                <span className="font-black text-sm sm:text-lg uppercase tracking-wider text-amber-950">
                  NATIONAL LEVEL EVENT
                </span>
              </div>
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-teal-800 bg-teal-50 border border-teal-200/80 px-4 py-1 rounded-full">
                Cybersecurity Awareness Month
              </span>
            </div>

            <p className="text-lg sm:text-xl font-bold tracking-tight text-slate-700 max-w-2xl mx-auto pt-1">
              {eventInfo.tagline}
            </p>
          </div>

          {/* Date & Location Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-sm font-medium text-slate-700 pt-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="font-bold text-slate-900">{eventInfo.dates || '29, 30 & 31 October 2026'}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="font-bold text-slate-900">{eventInfo.venue || 'Guru Nanak Dev Engineering College, Bidar'}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 shadow-xs font-semibold">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{eventInfo.prizeNotice}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-6">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-slate-900 text-white font-bold text-base shadow-md hover:bg-teal-700 hover:shadow-lg transition-all active:scale-95"
            >
              <span>Register Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={eventInfo.whatsappCommunityLink || EVENT_INFO.whatsappCommunityLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-md hover:shadow-emerald-500/20 transition-all active:scale-95 group"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white shrink-0 group-hover:scale-110 transition-transform" />
              <span>Join WhatsApp</span>
            </a>
            <Link
              href="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-base hover:bg-slate-50 hover:border-slate-400 transition-all active:scale-95 shadow-xs"
            >
              <span>Explore 10 Events</span>
            </Link>
          </div>

          {/* WhatsApp Community Quick Banner */}
          <div className="pt-2 flex items-center justify-center">
            <a
              href={eventInfo.whatsappCommunityLink || EVENT_INFO.whatsappCommunityLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/80 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors shadow-2xs group"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>Official WhatsApp Community is live • Team-ups, live notices & updates</span>
              <span className="text-emerald-600 group-hover:translate-x-0.5 transition-transform font-bold">&rarr;</span>
            </a>
          </div>

          {/* Live Countdown Timer */}
          <div className="pt-8">
            <div className="p-6 rounded-2xl bg-white border border-teal-200/80 shadow-sm max-w-xl mx-auto cyber-corner relative">
              {/* Telemetry pill */}
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-teal-700">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>COUNTDOWN // 29-OCT-2026</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                  <ShieldCheck className="w-3 h-3 text-teal-600" />
                  <span>NODE_ARMED</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Days</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Hours</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Mins</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Secs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
