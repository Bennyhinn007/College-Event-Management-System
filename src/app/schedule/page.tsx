import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ScheduleTimeline from '@/components/public/ScheduleTimeline';
import { dbRepository } from '@/lib/db/repository-selector';
import { EVENT_INFO, INITIAL_SCHEDULE } from '@/lib/constants';

// ISR: Cache statically at edge CDN, revalidate in background every 60s
export const revalidate = 60;

export const metadata = {
  title: 'Event Schedule | Hacktober 2026 | National Level Event | GNDEC Bidar',
  description: 'Official itinerary and timeline for Hacktober 2026 (29, 30 & 31 October 2026) — National Level Event conducted as part of Cybersecurity Awareness Month at Guru Nanak Dev Engineering College, Bidar.',
};

export default async function SchedulePage() {
  let eventInfo = EVENT_INFO;
  let schedule = INITIAL_SCHEDULE;

  try {
    const settings = await dbRepository.getSettings();
    if (settings) {
      if (settings.eventInfo && typeof settings.eventInfo === 'object') {
        eventInfo = {
          ...EVENT_INFO,
          ...(settings.eventInfo as Record<string, any>),
        };
      }
      if (settings.schedule && Array.isArray(settings.schedule)) {
        schedule = settings.schedule as typeof INITIAL_SCHEDULE;
      }
    }
  } catch (err) {
    console.error('[SchedulePage] Failed to fetch settings:', err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <div className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
              {eventInfo.dates || '29, 30 & 31 October 2026'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Event Timeline & Itinerary
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Follow session milestones across {schedule.length} intensive days at {eventInfo.venue || 'Guru Nanak Dev Engineering College, Bidar'}.
            </p>
          </div>
        </div>
        <ScheduleTimeline initialSchedule={schedule} initialEventInfo={eventInfo} />
      </main>
      <Footer initialEventInfo={eventInfo} />
    </div>
  );
}

