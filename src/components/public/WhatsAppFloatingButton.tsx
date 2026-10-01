'use client';

import { usePathname } from 'next/navigation';
import WhatsAppIcon from './WhatsAppIcon';
import { EVENT_INFO } from '@/lib/constants';

export default function WhatsAppFloatingButton() {
  const pathname = usePathname();

  // Don't render on admin dashboard pages or print previews
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const link = EVENT_INFO.whatsappCommunityLink;

  return (
    <div className="no-print fixed bottom-5 right-5 z-40 group">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join Hacktober 2026 WhatsApp Community"
        className="flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 active:scale-95 border-2 border-emerald-400/40 relative"
      >
        {/* Animated pulse ping */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400" />
        </span>

        <WhatsAppIcon className="w-5 h-5 fill-white shrink-0 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-black tracking-wide whitespace-nowrap hidden sm:inline">
          Join WhatsApp
        </span>
      </a>
    </div>
  );
}
