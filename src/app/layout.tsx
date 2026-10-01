import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { EVENT_INFO } from '@/lib/constants';

export const viewport: Viewport = {
  themeColor: '#0f766e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `${EVENT_INFO.name} | National Level Event | GNDEC Bidar`,
  description: `Official portal for ${EVENT_INFO.name} (29, 30 & 31 October 2026), a National Level Event conducted as part of Cybersecurity Awareness Month at ${EVENT_INFO.institution}.`,
  keywords: [
    'Hacktober 2026',
    'National Level Event',
    'Cybersecurity Awareness Month',
    'GNDEC Bidar',
    'Guru Nanak Dev Engineering College, Bidar',
    'Hackathon',
    'Technical Debugging',
    'Cybersecurity Debate',
    'Business & Master Case Study',
    'Cyber Hunt',
    'Learnathon',
    'Project Expo',
    'Reels & Memes',
    'On-Spot Painting & Sketch',
    'Cybersecurity Quiz',
    'College Hackathon',
  ],
  authors: [{ name: EVENT_INFO.department }],
  creator: EVENT_INFO.institution,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://hacktober.gndec.ac.in',
    title: `${EVENT_INFO.name} — National Level Event | Cybersecurity Awareness Month`,
    description: `29, 30 & 31 October 2026 • ${EVENT_INFO.institution}. National Level Event conducted as part of Cybersecurity Awareness Month featuring 10 official competitions.`,
    siteName: EVENT_INFO.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${EVENT_INFO.name} — National Level Event`,
    description: `29, 30 & 31 October 2026 • ${EVENT_INFO.institution}. Register now for this National Level Event.`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

import CyberBackground from '@/components/common/CyberBackground';
import WhatsAppFloatingButton from '@/components/public/WhatsAppFloatingButton';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-teal-100 selection:text-teal-900 relative">
        <CyberBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
