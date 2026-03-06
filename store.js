// data/store.js — In-memory data store (replace with MongoDB/PostgreSQL in production)
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const artists = [
  {
    id: 'a1',
    name: 'Luna Voss',
    slug: 'luna-voss',
    type: 'Musician',
    genre: 'Indie Folk / Singer-Songwriter',
    emoji: '🎸',
    bio: 'Luna grew up listening to the rain tap against her window in Shimla. That rhythm became the backbone of her music — intimate, weathered, and searingly honest. With three self-produced EPs and over 200 live performances, she weaves guitar fingerpicking with layered vocals that fill any room, café, or wedding hall with warmth.',
    city: 'Mumbai',
    state: 'Maharashtra',
    travelZones: ['Mumbai', 'Pune', 'Nashik', 'Goa'],
    fee: { amount: 8000, unit: 'event', currency: '₹' },
    hourlyRate: { amount: 2500, currency: '₹' },
    duration: { min: 1, max: 4, unit: 'hrs' },
    availability: {
      days: ['Mon', 'Wed', 'Fri', 'Sat', 'Sun'],
      slots: ['Morning (9am–12pm)', 'Evening (6pm–10pm)']
    },
    tags: ['Acoustic', 'Weddings', 'Cafés', 'Festivals', 'Private Parties'],
    languages: ['Hindi', 'English'],
    groupSize: 1,
    rating: 4.9,
    reviewCount: 87,
    bookingCount: 143,
    badge: 'Top Rated',
    recentWork: [
      { title: 'Bloom Sessions EP', year: 2024, type: 'Studio Recording' },
      { title: 'Kala Ghoda Arts Festival', year: 2024, type: 'Live Performance' },
      { title: 'The Leela Wedding Showcase', year: 2023, type: 'Corporate Event' }
    ],
    requirements: 'PA system, 1 microphone stand, power outlet',
    cancellationPolicy: '50% refund up to 7 days before event',
    instagram: '@lunavossmusic',
    spotifyMonthlyListeners: 14200,
    verified: true,
    createdAt: '2024-01-15'
  },
  {
    id: 'a2',
    name: 'Aria Krishnamurthy',
    slug: 'aria-krishnamurthy',
    type: 'Dancer',
    genre: 'Classical Bharatanatyam · Fusion',
    emoji: '💃',
    bio: 'Trained under Guru Padma Subramaniam for 14 years, Aria has performed on stages from Chennai\'s Music Academy to Edinburgh\'s Festival Fringe. She brings ancient Bharatanatyam into conversation with contemporary movement — a dialogue between history and now. Her performances are not just dances; they are stories your body feels.',
    city: 'Bengaluru',
    state: 'Karnataka',
    travelZones: ['Bengaluru', 'Mysuru', 'Chennai', 'Hyderabad'],
    fee: { amount: 5500, unit: 'hr', currency: '₹' },
    hourlyRate: { amount: 5500, currency: '₹' },
    duration: { min: 0.5, max: 2, unit: 'hrs' },
    availability: {
      days: ['Tue', 'Thu', 'Sat', 'Sun'],
      slots: ['Afternoon (2pm–6pm)', 'Evening (6pm–9pm)']
    },
    tags: ['Corporate Events', 'Cultural Festivals', 'Stage Shows', 'School Events'],
    languages: ['Tamil', 'Kannada', 'English'],
    groupSize: 1,
    rating: 4.8,
    reviewCount: 62,
    bookingCount: 98,
    badge: 'Trending',
    recentWork: [
      { title: 'Natyanjali Festival', year: 2024, type: 'Classical Concert' },
      { title: 'TED x Bengaluru Curtain Raiser', year: 2024, type: 'Corporate' },
      { title: 'Edinburgh Fringe Residency', year: 2023, type: 'International Tour' }
    ],
    requirements: 'Sprung wooden floor preferred, changing room, mirror',
    cancellationPolicy: '30% refund up to 5 days before event',
    instagram: '@ariakdances',
    verified: true,
    createdAt: '2024-02-20'
  },
  {
    id: 'a3',
    name: 'Zephyr the Great',
    slug: 'zephyr-the-great',
    type: 'Magician',
    genre: 'Close-Up Magic · Mentalism',
    emoji: '🎩',
    bio: 'Zephyr doesn\'t do tricks. He engineers wonder. A graduate of the prestigious Academie de Magie in Paris, Zephyr has baffled CEOs, children, and skeptics alike. His close-up work — performed inches from your face — blends psychology, sleight of hand, and pure theatre into moments guests will dissect for weeks.',
    city: 'Delhi',
    state: 'NCR',
    travelZones: ['Delhi', 'Gurgaon', 'Noida', 'Agra', 'Jaipur'],
    fee: { amount: 12000, unit: 'show', currency: '₹' },
    hourlyRate: { amount: 4000, currency: '₹' },
    duration: { min: 0.75, max: 3, unit: 'hrs' },
    availability: {
      days: ['Thu', 'Fri', 'Sat', 'Sun'],
      slots: ['Evening (5pm–11pm)']
    },
    tags: ['Private Parties', 'Kids Events', 'Gala Nights', 'Corporate', 'Weddings'],
    languages: ['Hindi', 'English'],
    groupSize: 1,
    rating: 4.7,
    reviewCount: 45,
    bookingCount: 71,
    badge: 'New',
    recentWork: [
      { title: 'ITC Maurya New Year\'s Gala', year: 2024, type: 'Hotel Event' },
      { title: 'Google India Offsite', year: 2024, type: 'Corporate' },
      { title: 'The Oberoi Birthday Special', year: 2023, type: 'Private Party' }
    ],
    requirements: 'Round tables for close-up work, good lighting, quiet corners',
    cancellationPolicy: 'No refund within 3 days. 60% refund beyond that.',
    instagram: '@zephyrthegreat',
    verified: true,
    createdAt: '2024-03-10'
  },
  {
    id: 'a4',
    name: 'The Brass Syndicate',
    slug: 'the-brass-syndicate',
    type: 'Band',
    genre: 'Brass / Jazz / Funk',
    emoji: '🎺',
    bio: 'Seven musicians. One unstoppable sound. The Brass Syndicate formed in the lanes of Kolkata\'s Park Street jazz scene and has since toured 12 cities. Equal parts New Orleans second line, Bollywood brass band, and downtown funk — they don\'t just play music, they start parades.',
    city: 'Kolkata',
    state: 'West Bengal',
    travelZones: ['Kolkata', 'Siliguri', 'Bhubaneswar', 'Patna'],
    fee: { amount: 35000, unit: 'event', currency: '₹' },
    hourlyRate: { amount: 12000, currency: '₹' },
    duration: { min: 1, max: 5, unit: 'hrs' },
    availability: {
      days: ['Fri', 'Sat', 'Sun'],
      slots: ['Evening (5pm–11pm)', 'Night (9pm–2am)']
    },
    tags: ['Weddings', 'Baraat', 'Festivals', 'Outdoor Events', 'Corporate'],
    languages: ['Bengali', 'Hindi', 'English'],
    groupSize: 7,
    rating: 4.9,
    reviewCount: 112,
    bookingCount: 189,
    badge: 'Top Rated',
    recentWork: [
      { title: 'Jio MAMI Film Festival Opening', year: 2024, type: 'Festival' },
      { title: 'Oberoi Grand Wedding Season', year: 2024, type: 'Wedding' },
      { title: 'Kolkata Jazz Festival', year: 2023, type: 'Jazz Concert' }
    ],
    requirements: 'Outdoor/indoor stage min 20x15ft, PA system (provided by venue), 3-phase power',
    cancellationPolicy: '40% refund up to 10 days before event',
    instagram: '@thebrasssyndicate',
    spotifyMonthlyListeners: 31000,
    verified: true,
    createdAt: '2023-11-05'
  },
  {
    id: 'a5',
    name: 'Kavya Nair',
    slug: 'kavya-nair',
    type: 'Dancer',
    genre: 'Contemporary / Kathak Fusion',
    emoji: '🩰',
    bio: 'Kavya\'s body speaks languages no tongue can pronounce. Trained in Kathak at Gandharva Mahavidyalaya and contemporary at JNASD, she has built a vocabulary of movement that is uniquely hers. Her solo works explore memory, migration, and the silence between words.',
    city: 'Pune',
    state: 'Maharashtra',
    travelZones: ['Pune', 'Mumbai', 'Nashik', 'Kolhapur'],
    fee: { amount: 7000, unit: 'hr', currency: '₹' },
    hourlyRate: { amount: 7000, currency: '₹' },
    duration: { min: 1, max: 2.5, unit: 'hrs' },
    availability: {
      days: ['Mon', 'Wed', 'Sat', 'Sun'],
      slots: ['Morning (10am–1pm)', 'Evening (5pm–9pm)']
    },
    tags: ['Stage Shows', 'Art Galleries', 'Cultural Events', 'Workshops'],
    languages: ['Marathi', 'Hindi', 'English'],
    groupSize: 1,
    rating: 4.6,
    reviewCount: 34,
    bookingCount: 52,
    badge: null,
    recentWork: [
      { title: 'Prithvi Theatre Season', year: 2024, type: 'Theatre' },
      { title: 'Pune Festival of Arts', year: 2024, type: 'Festival' }
    ],
    requirements: 'Sprung floor essential, sound system for 200+ pax',
    cancellationPolicy: '50% refund up to 7 days before event',
    instagram: '@kavyadances',
    verified: true,
    createdAt: '2024-04-01'
  },
  {
    id: 'a6',
    name: 'DJ Neon Flux',
    slug: 'dj-neon-flux',
    type: 'Musician',
    genre: 'Electronic / House / Techno',
    emoji: '🎛️',
    bio: 'Real name Rohan Mehta. He started mixing in a Dharavi recording studio at 16 with a pirated copy of FL Studio and a stolen dream. A decade later, Neon Flux has headlined Magnetic Fields, Sunburn Arena, and Berlin\'s Tresor. His sets are architecture — built meticulously, demolished gloriously.',
    city: 'Mumbai',
    state: 'Maharashtra',
    travelZones: ['Mumbai', 'Pune', 'Goa', 'Delhi', 'Bengaluru'],
    fee: { amount: 25000, unit: 'show', currency: '₹' },
    hourlyRate: { amount: 8000, currency: '₹' },
    duration: { min: 2, max: 6, unit: 'hrs' },
    availability: {
      days: ['Fri', 'Sat'],
      slots: ['Night (9pm–4am)']
    },
    tags: ['Clubs', 'Festivals', 'Corporate After-Parties', 'Outdoor Raves'],
    languages: ['Hindi', 'English'],
    groupSize: 1,
    rating: 4.8,
    reviewCount: 95,
    bookingCount: 167,
    badge: 'Trending',
    recentWork: [
      { title: 'Magnetic Fields 2024 Headline', year: 2024, type: 'Festival' },
      { title: 'Percept NYE Mumbai', year: 2023, type: 'New Year\'s Event' }
    ],
    requirements: 'Pioneer CDJ-3000s or Technics SL-1210, DJM-900NXS2 mixer, monitor speakers',
    cancellationPolicy: 'No refunds. Rescheduling allowed once.',
    instagram: '@djneonflux',
    spotifyMonthlyListeners: 88000,
    verified: true,
    createdAt: '2023-09-15'
  }
];

const bookings = [];
const users = [];

// Seed one test user
const seedUser = async () => {
  const hash = await bcrypt.hash('password123', 10);
  users.push({
    id: uuidv4(),
    name: 'Test User',
    email: 'test@artwave.in',
    passwordHash: hash,
    role: 'client',
    createdAt: new Date().toISOString()
  });
};
seedUser();

module.exports = { artists, bookings, users };
