// Native env loaded via node --env-file=.env.local


import { dbRepository } from '../src/lib/db/repository-selector';
import { EVENT_INFO, INITIAL_SCHEDULE } from '../src/lib/constants';

async function main() {
  console.log('Connecting to database and updating eventInfo & schedule...');
  const current = await dbRepository.getSettings();
  console.log('Current keys in DB:', Object.keys(current));

  const updatedEventInfo = {
    ...EVENT_INFO,
    ...((current.eventInfo as Record<string, unknown>) || {}),
    classification: 'NATIONAL LEVEL EVENT',
    initiative: 'Cybersecurity Awareness Month',
    dates: '5, 6 & 7 November 2026',
    datesShort: '5–7 November 2026',
    startDate: '2026-11-05T09:00:00+05:30',
    endDate: '2026-11-07T18:00:00+05:30',
    venue: 'Guru Nanak Dev Engineering College, Bidar',
    institution: 'Guru Nanak Dev Engineering College, Bidar',
    contactPhone: EVENT_INFO.contactPhone,
    paymentUpiId: EVENT_INFO.paymentUpiId,
    paymentLink: EVENT_INFO.paymentLink,
  };

  await dbRepository.updateSetting('eventInfo', updatedEventInfo, 'system@gndec.ac.in');
  console.log('✓ Updated eventInfo with National Level Event, Cybersecurity Awareness Month, dates: "5, 6 & 7 November 2026", and venue: "Guru Nanak Dev Engineering College, Bidar"');

  // Also update schedule to 3-day schedule for 5, 6 & 7 November
  await dbRepository.updateSetting('schedule', INITIAL_SCHEDULE, 'system@gndec.ac.in');
  console.log('✓ Updated schedule to 3-day schedule (5, 6 & 7 November 2026)');

  // Also update pricing for cybersecurity-quiz to Rs. 79
  const currentPricing = ((current.pricing as Record<string, unknown>) || {});
  const updatedPricing = {
    ...currentPricing,
    'cybersecurity-quiz': { price: 79, status: 'ACTIVE' },
  };
  await dbRepository.updateSetting('pricing', updatedPricing, 'system@gndec.ac.in');
  console.log('✓ Updated pricing for cybersecurity-quiz to Rs. 79');

  const refreshed = await dbRepository.getSettings();
  console.log('Refreshed eventInfo classification:', (refreshed.eventInfo as any)?.classification);
  console.log('Refreshed eventInfo initiative:', (refreshed.eventInfo as any)?.initiative);
  console.log('Refreshed eventInfo dates:', (refreshed.eventInfo as any)?.dates);
  console.log('Refreshed eventInfo venue:', (refreshed.eventInfo as any)?.venue);
  console.log('Refreshed schedule days:', (refreshed.schedule as any)?.map((d: any) => `${d.day}: ${d.date}`));
  console.log('Refreshed pricing quiz:', (refreshed.pricing as any)?.['cybersecurity-quiz']);
  process.exit(0);
}

main().catch((err) => {
  console.error('Error running sync-dates:', err);
  process.exit(1);
});
