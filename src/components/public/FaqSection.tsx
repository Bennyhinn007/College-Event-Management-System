'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Mail, MapPin, Phone, QrCode } from 'lucide-react';
import { EVENT_INFO, EVENT_COORDINATORS, PAYMENT_ORGANIZERS } from '@/lib/constants';

const FAQ_ITEMS = [
  {
    q: 'How does event pricing work?',
    a: 'Each event has a specific registration fee: Individual events range from ₹79 to ₹199 per person (Learnathon ₹199, Debugging ₹99, Painting ₹99, Quiz ₹99, Debate ₹79, Reels & Memes ₹79), while Team events (Hackathon, Business & Master Case Study, Cyber Hunt, and Project Expo) range from ₹199 to ₹750 per team. Team event fees are charged once per team regardless of whether you have 1, 2, 3, or 4 members.',
  },
  {
    q: 'Which UPI IDs and payment QR codes should I use to pay?',
    a: 'You can transfer the registration fee to any of our 3 official payment coordinators via PhonePe, Google Pay, Paytm, or BHIM UPI: Shweta Mulge (7975449981@axl), Apeksha (8618058871@axl), or Nandini (9353431169@ybl). All 3 QR codes are available directly on the registration portal.',
  },
  {
    q: 'How does registration work for team events?',
    a: 'When you select any team event (Hackathon, Business & Master Case Study, Cyber Hunt, or Project Expo), you can name your team and register up to 4 members (1 Team Leader + up to 3 team members) directly in the online registration form. The registration fee is charged once for the entire team.',
  },
  {
    q: 'What is the team size limit for team events?',
    a: 'Team events allow a maximum of 4 members per team (1 Team Leader plus up to 3 additional members). Individual events allow exactly 1 participant per registration.',
  },
  {
    q: 'What happens after I submit my registration and payment screenshot?',
    a: 'You will receive a unique Registration ID (format: HT26-XXXXXX) along with a verification QR pass. Your payment status will be marked as PENDING. Once the organizing committee verifies your transaction UTR against bank records, your status will update to VERIFIED.',
  },
  {
    q: 'Is Hacktober 2026 a National Level Event?',
    a: 'Yes! The entire Hacktober 2026 event and all its competitions are conducted as a National Level Event as part of Cybersecurity Awareness Month at Guru Nanak Dev Engineering College, Bidar.',
  },
  {
    q: 'What should I bring on event days (29, 30 & 31 October 2026)?',
    a: 'All participants must bring their original College Student ID card and their digital or printed Hacktober 2026 Confirmation Pass containing their QR code for event check-in.',
  },
  {
    q: 'What are the prizes for winning participants?',
    a: 'Winners of the Hacktober 2026 events can win exciting cash prizes and gadgets worth up to ₹15,000!',
  },
];

interface FaqSectionProps {
  initialEventInfo?: typeof EVENT_INFO;
}

export default function FaqSection({ initialEventInfo }: FaqSectionProps = {}) {
  const [eventInfo] = useState(initialEventInfo || EVENT_INFO);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* FAQ Column */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold uppercase tracking-wider mb-2">
                <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                <span>Clarifications</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 hover:text-teal-700"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
                          isOpen ? 'rotate-180 text-teal-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact / Venue Info Card */}
          <div id="contact" className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Contact & Venue Inquiries</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Department of CSE, IoT and Cybersecurity including Blockchain Technology
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Campus Venue</span>
                    <p className="text-slate-600">
                      Guru Nanak Dev Engineering College, Bidar
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Official Support Email</span>
                    <p className="text-slate-600 font-mono">{eventInfo.contactEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Organizer Helpline</span>
                    <p className="text-slate-600 font-mono">{eventInfo.contactPhone}</p>
                  </div>
                </div>

                {/* Event Coordinators */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900 block mb-2 text-xs uppercase tracking-wider">
                    Student Coordinators (Events)
                  </span>
                  <div className="space-y-2">
                    {EVENT_COORDINATORS.map((coord) => (
                      <div
                        key={coord.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs"
                      >
                        <div>
                          <strong className="text-slate-900 block">{coord.name}</strong>
                          <span className="text-[11px] text-teal-700 font-medium">{coord.role}</span>
                        </div>
                        <a
                          href={`tel:+91${coord.phone}`}
                          className="font-mono font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60"
                        >
                          <Phone className="w-3 h-3" />
                          <span>+91 {coord.phone}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Coordinators */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900 block mb-2 text-xs uppercase tracking-wider">
                    Student Coordinators (Payment)
                  </span>
                  <div className="space-y-2">
                    {PAYMENT_ORGANIZERS.map((org) => (
                      <div
                        key={org.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs"
                      >
                        <div>
                          <strong className="text-slate-900 block">{org.name}</strong>
                          <span className="font-mono text-[11px] text-slate-500">{org.upiId}</span>
                        </div>
                        <a
                          href={`tel:+91${org.phone}`}
                          className="font-mono font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60"
                        >
                          <Phone className="w-3 h-3" />
                          <span>+91 {org.phone}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
                <span>Faculty Coordinators: <strong className="text-slate-800">Prof. Arti</strong></span>
                <p className="mt-1">
                  For immediate assistance during registration, visit the Department office during college hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
