// Centralized Constants & Configurations for Hacktober 2026
// Guru Nanak Dev Engineering College, Bidar

export interface EventDefinition {
  id: string;
  name: string;
  slug: string;
  eventType: string;
  type: 'INDIVIDUAL' | 'TEAM';
  maxTeamSize: number;
  minTeamSize: number;
  fee: number;
  feeDisplay: string;
  duration?: string;
  format?: string;
  icon: string;
  description: string;
}

export const OFFICIAL_EVENTS: EventDefinition[] = [
  {
    id: 'hackathon',
    name: 'Hackathon',
    slug: 'hackathon',
    eventType: 'Hackathon',
    type: 'TEAM',
    minTeamSize: 1,
    maxTeamSize: 4,
    fee: 750,
    feeDisplay: '₹750 / Team',
    duration: '8 Hours',
    icon: 'Terminal',
    description:
      'Build innovative solutions to real-world problems through coding, creativity, and teamwork in an intensive 8-hour competition.',
  },
  {
    id: 'technical-debugging',
    name: 'Debugging',
    slug: 'technical-debugging',
    eventType: 'Technical Competition',
    type: 'INDIVIDUAL',
    minTeamSize: 1,
    maxTeamSize: 1,
    fee: 99,
    feeDisplay: '₹99 / Person',
    icon: 'Bug',
    description:
      'Identify programming errors, fix bugs, and solve challenging coding problems with speed and accuracy.',
  },
  {
    id: 'cybersecurity-debate',
    name: 'Debate on Cyber Security',
    slug: 'cybersecurity-debate',
    eventType: 'Debate',
    type: 'INDIVIDUAL',
    minTeamSize: 1,
    maxTeamSize: 1,
    fee: 79,
    feeDisplay: '₹79 / Person',
    icon: 'MessageSquareText',
    description:
      'Express your views, challenge perspectives, and discuss cybersecurity issues, digital privacy, and online safety.',
  },
  {
    id: 'business-master-case-study',
    name: 'Business & Masters Case Study',
    slug: 'business-master-case-study',
    eventType: 'Case Study Competition',
    type: 'TEAM',
    minTeamSize: 1,
    maxTeamSize: 4,
    fee: 199,
    feeDisplay: '₹199 / Team',
    icon: 'Briefcase',
    description:
      'Analyze real-world business scenarios, develop strategic solutions, and demonstrate critical thinking and decision-making skills.',
  },
  {
    id: 'cyber-hunt',
    name: 'Cyber Hunt',
    slug: 'cyber-hunt',
    eventType: 'Cybersecurity Competition',
    format: '50 Cyber Hunt Challenges',
    type: 'TEAM',
    minTeamSize: 1,
    maxTeamSize: 4,
    fee: 360,
    feeDisplay: '₹360 / Team',
    icon: 'ShieldAlert',
    description:
      'Solve cybersecurity challenges, uncover hidden clues, and test your investigation and problem-solving abilities.',
  },
  {
    id: 'learnathon',
    name: 'Learnathon',
    slug: 'learnathon',
    eventType: 'Website Building Competition',
    duration: '60 Minutes',
    type: 'INDIVIDUAL',
    minTeamSize: 1,
    maxTeamSize: 1,
    fee: 99,
    feeDisplay: '₹99 / Person',
    icon: 'Code',
    description:
      'Showcase your creativity and web development skills by building an impressive website within the given time limit.',
  },
  {
    id: 'project-expo',
    name: 'LATENT: Project Innovation Expo',
    slug: 'project-expo',
    eventType: 'Project Exhibition',
    type: 'TEAM',
    minTeamSize: 1,
    maxTeamSize: 4,
    fee: 200,
    feeDisplay: '₹200 / Team',
    icon: 'Cpu',
    description:
      'Present innovative projects, demonstrate technical expertise, and share creative solutions with fellow innovators.',
  },
  {
    id: 'reels-memes',
    name: 'Reels & Memes',
    slug: 'reels-memes',
    eventType: 'Creative Competition',
    type: 'INDIVIDUAL',
    minTeamSize: 1,
    maxTeamSize: 1,
    fee: 79,
    feeDisplay: '₹79 / Person',
    icon: 'Video',
    description:
      'Combine creativity, humour, and technology to create engaging reels or memes promoting cybersecurity awareness and digital safety.',
  },
  {
    id: 'on-spot-painting-sketch',
    name: 'On-Spot Painting / Sketch',
    slug: 'on-spot-painting-sketch',
    eventType: 'Art Competition',
    type: 'INDIVIDUAL',
    minTeamSize: 1,
    maxTeamSize: 1,
    fee: 99,
    feeDisplay: '₹99 / Person',
    icon: 'Palette',
    description:
      'Showcase your artistic talent through original paintings or sketches inspired by the given theme.',
  },
  {
    id: 'cybersecurity-quiz',
    name: 'Cyber Security Quiz',
    slug: 'cybersecurity-quiz',
    eventType: 'Cybersecurity Quiz',
    type: 'INDIVIDUAL',
    minTeamSize: 1,
    maxTeamSize: 1,
    fee: 79,
    feeDisplay: '₹79 / Person',
    icon: 'BrainCircuit',
    description:
      'Test your knowledge of cybersecurity, ethical hacking, networking, digital privacy, and emerging security technologies.',
  },
  {
    id: 'cyber-hygiene',
    name: 'Cyber Hygiene',
    slug: 'cyber-hygiene',
    eventType: 'Faculty Workshop',
    type: 'INDIVIDUAL',
    minTeamSize: 1,
    maxTeamSize: 1,
    fee: 0,
    feeDisplay: 'Free (Teachers Only)',
    icon: 'GraduationCap',
    description:
      'For teachers only. Explore essential cyber hygiene practices, recognize online threats, and learn how to protect personal and professional information from cyberattacks.',
  },
];

// Centralized Event Pricing Record
export const INITIAL_PRICING_CONFIG: Record<string, number> = {
  'hackathon': 750,
  'technical-debugging': 99,
  'cybersecurity-debate': 79,
  'business-master-case-study': 199,
  'cyber-hunt': 360,
  'learnathon': 99,
  'project-expo': 200,
  'reels-memes': 79,
  'on-spot-painting-sketch': 99,
  'cybersecurity-quiz': 79,
  'cyber-hygiene': 0,
};

export interface PricingTierConfig {
  eventId?: string;
  eventCount?: number;
  price: number | null;
  status: 'ACTIVE' | 'TBD';
  notice?: string;
}

export interface PricingCalculationResult {
  count: number;
  isConfigured: boolean;
  amount: number | null;
  displayAmount: string;
  notice: string | null;
  canProceed: boolean;
  breakdown?: Array<{ id: string; name: string; fee: number; isTeam: boolean }>;
}

export function calculateRegistrationPrice(
  selectedEventIds: string[],
  customConfig?: Record<string, unknown>
): PricingCalculationResult {
  const count = selectedEventIds.length;
  if (count === 0) {
    return {
      count: 0,
      isConfigured: true,
      amount: 0,
      displayAmount: '₹0',
      notice: 'Please select at least 1 event.',
      canProceed: false,
      breakdown: [],
    };
  }

  let total = 0;
  const breakdown: Array<{ id: string; name: string; fee: number; isTeam: boolean }> = [];

  for (const id of selectedEventIds) {
    const event = OFFICIAL_EVENTS.find((e) => e.id === id);
    if (!event) continue;

    let fee = event.fee;
    if (customConfig && typeof customConfig === 'object') {
      const customVal = (customConfig as Record<string, unknown>)[id];
      if (typeof customVal === 'number') {
        fee = customVal;
      } else if (
        customVal &&
        typeof customVal === 'object' &&
        'price' in customVal &&
        typeof (customVal as { price: unknown }).price === 'number'
      ) {
        fee = (customVal as { price: number }).price;
      }
    }

    total += fee;
    breakdown.push({
      id: event.id,
      name: event.name,
      fee,
      isTeam: event.type === 'TEAM',
    });
  }

  return {
    count,
    isConfigured: true,
    amount: total,
    displayAmount: `₹${total}`,
    notice: null,
    canProceed: true,
    breakdown,
  };
}

export interface PaymentOrganizer {
  id: string;
  name: string;
  upiId: string;
  qrImage: string;
  phone: string;
  app: string;
  note?: string;
}

export const PAYMENT_ORGANIZERS: PaymentOrganizer[] = [
  {
    id: 'shweta-mulge',
    name: 'Shweta Mulge',
    upiId: '7975449981@axl',
    qrImage: '/qr/shweta-mulge.jpg',
    phone: '7975449981',
    app: 'PhonePe / Any UPI App',
    note: 'Payment Coordinator',
  },
  {
    id: 'apeksha',
    name: 'Apeksha',
    upiId: '8618058871@axl',
    qrImage: '/qr/apeksha.jpg',
    phone: '8618058871',
    app: 'PhonePe / Any UPI App',
    note: 'Payment Coordinator',
  },
  {
    id: 'nandini',
    name: 'Nandini',
    upiId: '9353431169@ybl',
    qrImage: '/qr/nandini.jpg',
    phone: '9353431169',
    app: 'PhonePe / Any UPI App',
    note: 'Payment Coordinator',
  },
];

export interface EventCoordinator {
  id: string;
  name: string;
  phone: string;
  role: string;
}

export const EVENT_COORDINATORS: EventCoordinator[] = [
  {
    id: 'bennyhinn',
    name: 'Bennyhinn',
    phone: '7019025650',
    role: 'Event Coordinator',
  },
  {
    id: 'rishikesh-auradkar',
    name: 'Rishikesh Auradkar',
    phone: '8431008974',
    role: 'Event Coordinator',
  },
  {
    id: 'shweta',
    name: 'Shweta',
    phone: '7975449981',
    role: 'Event Coordinator',
  },
];

export const EVENT_INFO = {
  name: 'Hacktober 2026',
  tagline: 'Think. Hack. Defend. Debug.',
  classification: 'NATIONAL LEVEL EVENT',
  initiative: 'Cybersecurity Awareness Month',
  dates: '5, 6 & 7 November 2026',
  datesShort: '5–7 November 2026',
  startDate: '2026-11-05T09:00:00+05:30',
  endDate: '2026-11-07T18:00:00+05:30',
  institution: 'Guru Nanak Dev Engineering College, Bidar',
  department: 'Department of CSE, IoT and Cybersecurity including Blockchain Technology',
  prizeNotice: 'Cash prizes and gadgets worth up to ₹15,000!',
  venue: 'Guru Nanak Dev Engineering College, Bidar',
  contactEmail: 'hacktober@gndec.ac.in',
  contactPhone: '+91 7019025650 / +91 8431008974 / +91 7975449981',
  paymentUpiId: '7975449981@axl (Shweta Mulge) / 8618058871@axl (Apeksha) / 9353431169@ybl (Nandini)',
  paymentLink: 'upi://pay?pa=7975449981@axl&pn=Shweta%20Mulge&cu=INR&tn=Hacktober%202026%20Registration',
  paymentQrImage: '/qr/shweta-mulge.jpg',
  whatsappCommunityLink: 'https://chat.whatsapp.com/DvLGYPby9sl0G21baJqxt7',
};

export const INITIAL_SCHEDULE = [
  {
    day: 'Day 1',
    date: '5 November 2026',
    items: [
      { event: 'Inauguration & Keynote Address (Cybersecurity Awareness Month)', time: 'TBD', venue: 'TBD', type: 'GENERAL' },
      { event: 'Hackathon (Kickoff & Problem Statements)', time: 'TBD', venue: 'TBD', type: 'EVENT' },
      { event: 'Debugging', time: 'TBD', venue: 'TBD', type: 'EVENT' },
      { event: 'Debate on Cyber Security', time: 'TBD', venue: 'TBD', type: 'EVENT' },
    ],
  },
  {
    day: 'Day 2',
    date: '6 November 2026',
    items: [
      { event: 'Business & Masters Case Study', time: 'TBD', venue: 'TBD', type: 'EVENT' },
      { event: 'Cyber Hunt (50 Cyber Hunt Challenges)', time: 'TBD', venue: 'TBD', type: 'EVENT' },
      { event: 'Learnathon (Website Building Competition)', time: 'TBD', venue: 'TBD', type: 'EVENT' },
      { event: 'Cyber Hygiene (Teachers Workshop)', time: 'TBD', venue: 'TBD', type: 'EVENT' },
    ],
  },
  {
    day: 'Day 3',
    date: '7 November 2026',
    items: [
      { event: 'LATENT: Project Innovation Expo', time: 'TBD', venue: 'TBD', type: 'EVENT' },
      { event: 'Reels & Memes', time: 'TBD', venue: 'TBD', type: 'EVENT' },
      { event: 'On-Spot Painting / Sketch', time: 'TBD', venue: 'TBD', type: 'EVENT' },
      { event: 'Cyber Security Quiz', time: 'TBD', venue: 'TBD', type: 'EVENT' },
      { event: 'Valedictory & Prize Distribution', time: 'TBD', venue: 'TBD', type: 'GENERAL' },
    ],
  },
];

export const GENERAL_RULES = [
  'Participants must provide accurate registration information.',
  'Participants must carry valid college/student identification.',
  'Each participant must register using a valid email address and phone number.',
  'Team events allow a maximum of 4 members.',
  'Individual events cannot be transferred to another participant without organizer approval.',
  'Participants must follow event-specific rules.',
  'Any form of cheating, impersonation, plagiarism, unauthorized system access, or disruptive behavior may result in disqualification.',
  'Participants must report before the specified event start time.',
  'Organizers reserve the right to verify registration and payment information.',
  'Payment once verified should not be considered automatically refundable unless organizers explicitly configure a refund policy.',
  'Participants must follow applicable cybersecurity laws and event rules.',
  'For cybersecurity challenges, participants may interact only with systems explicitly authorized by the organizers.',
];

export const DISQUALIFICATION_DISCLAIMER =
  'Disclaimer: Final schedule, rules, and venue allocations may be updated by the organizing committee. Official announcements will be notified via registered email and the notice board.';

export const ALLOWED_SEMESTERS = ['1st Sem', '3rd Sem', '5th Sem', '7th Sem', 'Faculty'] as const;
export type AllowedSemester = (typeof ALLOWED_SEMESTERS)[number];
