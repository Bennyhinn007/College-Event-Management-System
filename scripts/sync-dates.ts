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
    dates: '29, 30 & 31 October 2026',
    datesShort: '29–31 October 2026',
    startDate: '2026-10-29T09:00:00+05:30',
    endDate: '2026-10-31T18:00:00+05:30',
    venue: 'Guru Nanak Dev Engineering College, Bidar',
    institution: 'Guru Nanak Dev Engineering College, Bidar',
    contactPhone: EVENT_INFO.contactPhone,
    paymentUpiId: EVENT_INFO.paymentUpiId,
    paymentLink: EVENT_INFO.paymentLink,
  };

  await dbRepository.updateSetting('eventInfo', updatedEventInfo, 'system@gndec.ac.in');
  console.log('✓ Updated eventInfo with National Level Event, Cybersecurity Awareness Month, dates: "29, 30 & 31 October 2026", and venue: "Guru Nanak Dev Engineering College, Bidar"');

  // Also update schedule to 3-day schedule for 29, 30 & 31 October
  await dbRepository.updateSetting('schedule', INITIAL_SCHEDULE, 'system@gndec.ac.in');
  console.log('✓ Updated schedule to 3-day schedule (29, 30 & 31 October 2026)');

  const refreshed = await dbRepository.getSettings();
  console.log('Refreshed eventInfo classification:', (refreshed.eventInfo as any)?.classification);
  console.log('Refreshed eventInfo initiative:', (refreshed.eventInfo as any)?.initiative);
  console.log('Refreshed eventInfo dates:', (refreshed.eventInfo as any)?.dates);
  console.log('Refreshed eventInfo venue:', (refreshed.eventInfo as any)?.venue);
  console.log('Refreshed schedule days:', (refreshed.schedule as any)?.map((d: any) => `${d.day}: ${d.date}`));
  process.exit(0);
}

main().catch((err) => {
  console.error('Error running sync-dates:', err);
  process.exit(1);
});
