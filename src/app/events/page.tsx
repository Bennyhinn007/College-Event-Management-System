import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import EventCards from '@/components/public/EventCards';
import { dbRepository } from '@/lib/db/repository-selector';
import { EVENT_INFO, INITIAL_PRICING_CONFIG, PricingTierConfig } from '@/lib/constants';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: '10 Official Events | Hacktober 2026 | National Level Event | GNDEC Bidar',
  description: 'Explore the 10 official competitions of Hacktober 2026 — National Level Event conducted as part of Cybersecurity Awareness Month at Guru Nanak Dev Engineering College, Bidar on 29, 30 & 31 October 2026.',
};

export default async function EventsPage() {
  let eventInfo = EVENT_INFO;
  let pricing: Record<string, unknown> = INITIAL_PRICING_CONFIG;

  try {
    const settings = await dbRepository.getSettings();
    if (settings) {
      if (settings.eventInfo && typeof settings.eventInfo === 'object') {
        eventInfo = {
          ...EVENT_INFO,
          ...(settings.eventInfo as Record<string, any>),
        };
      }
      if (settings.pricing && typeof settings.pricing === 'object') {
        pricing = settings.pricing as Record<string, unknown>;
      }
    }
  } catch (err) {
    console.error('[EventsPage] Failed to fetch settings:', err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <div className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              10 Official Competitions • {eventInfo.dates || '29, 30 & 31 October 2026'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Official Events & Competitions
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Choose your challenges across individual cybersecurity battles and 4-member collaborative team hackathons at {eventInfo.venue || 'Guru Nanak Dev Engineering College, Bidar'}.
            </p>
          </div>
        </div>
        <EventCards initialPricing={pricing} />
      </main>
      <Footer initialEventInfo={eventInfo} />
    </div>
  );
}

