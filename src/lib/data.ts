// Site content and booking configuration. Business details (name, contacts, location, host) come from
// content/site.ts; the copy below is written around them.
import { SITE, SITE_PLACE } from "@site";

export const CONFIG = {
  momo: SITE.payments.momo,
  momoName: SITE.payments.momoName,
  // WhatsApp goes to this number only.
  adminWhatsApp: SITE.contact.whatsapp.replace(/[^0-9]/g, ""),
  whatsappDisplay: SITE.contact.whatsapp,
  ugxRate: SITE.pricing.ugxRate,
  cleaningFee: SITE.pricing.cleaningFee,
  serviceFeePct: SITE.pricing.serviceFeePct,
  taxPct: SITE.pricing.taxPct,
  enableSplitPay: true,
  // Placeholder availability until bookings live in a database.
  showBlockedDates: true,
  phones: SITE.contact.phones,
  email: SITE.contact.email,
  // Booking questions: shown next to booking, checkout and payment steps.
  reservationsEmail: SITE.contact.reservationsEmail,
  // The host's address, shown where the site talks about them.
  founderEmail: SITE.host.email,
} as const;

export type ApartmentId = "apartment-1" | "apartment-2";

export type Photo = { src: string; alt: string };

export type Apartment = {
  id: ApartmentId;
  name: string;
  kind: string;
  /** One-line description for listing cards. */
  blurb: string;
  loc: string;
  price: number;
  sleeps: string;
  tag: string;
  desc: string;
  amenities: string[];
  images: [string, string, string];
  /** Full album shown in the photo viewer (starts with `images`). */
  gallery: Photo[];
  specs: { area: string; guests: string; beds: string; baths: string };
};

const DESC =
  "Relax in a beautifully furnished room where every piece is chosen for comfort and style. Soft bedding, elegant furniture, and thoughtful décor create a warm, inviting atmosphere that makes you feel right at home. Modern conveniences like high-speed Wi-Fi, a flat-screen TV and air conditioning ensure a comfortable stay, while large windows fill the apartment with natural light.";

const AMENITIES = [
  "Modern kitchen",
  "Cooker with oven",
  "Fridge and microwave",
  "Cookware",
  "Free WiFi",
  "Smart TV with Netflix",
  "Hot water",
  "24/7 security",
  "Ample secure parking",
  "Laundry (at a fee)",
];

const SPECS = { area: "560 ft²", guests: "2 Guests", beds: "1 Bed", baths: "1 Bathroom" };


// Shared spaces appear at the end of both apartment albums.
const SHARED_PHOTOS: Photo[] = [];

// The bedroom photos are deliberately swapped between the apartments.
export const APARTMENTS: Apartment[] = [
  {
    id: "apartment-1",
    name: "The Kyebando Home",
    kind: "Kyebando",
    blurb: "A calm, fully furnished one-bed in Kyebando — open kitchen, Netflix-ready TV and secure parking at the door.",
    loc: "Kyebando, Kampala",
    price: 40,
    sleeps: "Sleeps 2 · 1 bedroom",
    tag: "UGX 150k/night",
    desc: DESC,
    amenities: AMENITIES,
    images: ["https://images.pexels.com/photos/6782353/pexels-photo-6782353.jpeg?auto=compress&cs=tinysrgb&w=1600", "https://images.pexels.com/photos/6782351/pexels-photo-6782351.jpeg?auto=compress&cs=tinysrgb&w=1600", "https://images.pexels.com/photos/6782569/pexels-photo-6782569.jpeg?auto=compress&cs=tinysrgb&w=1600"],
    gallery: [
      { src: "https://images.pexels.com/photos/6782353/pexels-photo-6782353.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Living room" },
      { src: "https://images.pexels.com/photos/6782351/pexels-photo-6782351.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Living room and kitchen" },
      { src: "https://images.pexels.com/photos/6782569/pexels-photo-6782569.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Sofa by the kitchen counter" },
      ...SHARED_PHOTOS,
    ],
    specs: SPECS,
  },
  {
    id: "apartment-2",
    name: "The Ntinda Home",
    kind: "Ntinda",
    blurb: "Soft neutrals and a cosy lounge in Ntinda — close to cafés and shops, with 24/7 security.",
    loc: "Ntinda, Kampala",
    price: 40,
    sleeps: "Sleeps 2 · 1 bedroom",
    tag: "UGX 150k/night",
    desc: DESC,
    amenities: AMENITIES,
    images: ["https://images.pexels.com/photos/6580396/pexels-photo-6580396.jpeg?auto=compress&cs=tinysrgb&w=1600", "https://images.pexels.com/photos/6580416/pexels-photo-6580416.jpeg?auto=compress&cs=tinysrgb&w=1600", "https://images.pexels.com/photos/6580416/pexels-photo-6580416.jpeg?auto=compress&cs=tinysrgb&w=1600"],
    gallery: [
      { src: "https://images.pexels.com/photos/6580396/pexels-photo-6580396.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Living room" },
      { src: "https://images.pexels.com/photos/6580416/pexels-photo-6580416.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Couch and round coffee table" },
      ...SHARED_PHOTOS,
    ],
    specs: SPECS,
  },
];

/**
 * Photo tour played by the home "Take a tour" block until the video is ready:
 * each apartment's rooms, then the shared spaces once.
 */
export const TOUR_SLIDES: Photo[] = [
  ...APARTMENTS.flatMap((a) =>
    a.gallery
      .filter((p) => !SHARED_PHOTOS.some((x) => x.src === p.src))
      .map((p) => ({ src: p.src, alt: `${a.name} · ${p.alt}` })),
  ),
  ...SHARED_PHOTOS,
];

export function getApartment(id: string | null | undefined): Apartment {
  return APARTMENTS.find((a) => a.id === id) ?? APARTMENTS[0];
}

/** Album behind the home page photo collage. */
export const HOME_PHOTOS: Photo[] = [
  { src: "https://images.pexels.com/photos/6782353/pexels-photo-6782353.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: `${SITE.name} living room` },
  { src: "https://images.pexels.com/photos/6782351/pexels-photo-6782351.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Kyebando home living room and kitchen" },
  { src: "https://images.pexels.com/photos/6580396/pexels-photo-6580396.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Ntinda home living room" },
  { src: "https://images.pexels.com/photos/6580416/pexels-photo-6580416.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Couch and round coffee table" },
];

/** Home page tour video. Drop the file at public/videos/selah-tour.mp4. */
export const TOUR_VIDEO = {
  src: "/videos/selah-tour.mp4",
  poster: "https://images.pexels.com/photos/6782353/pexels-photo-6782353.jpeg?auto=compress&cs=tinysrgb&w=1600",
  title: `A walk through ${SITE.name}`,
};

export const FILTERS = ["All homes", "Kyebando", "Ntinda"] as const;

export const ICONS = {
  area: ["M3.8 3.8h16.4v16.4H3.8z", "m9.6 14.4 4.8-4.8", "M9.6 11.6v2.8h2.8", "M14.4 12.4V9.6h-2.8"],
  guests: [
    "M9.4 11.2a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6",
    "M2.9 19.6a6.5 6.5 0 0 1 13 0",
    "M15.8 5.2a3.1 3.1 0 0 1 0 5.9",
    "M17.3 13.6a5.7 5.7 0 0 1 3.8 6",
  ],
  bed: ["M3 18.4v-6.6h18v6.6", "M3 18.4v2.2", "M21 18.4v2.2", "M6 11.8V8.2h12v3.6", "M8.6 11.8v-1.6h6.8v1.6"],
  bath: [
    "M2.8 12.6h18.4",
    "M4.6 12.6v3.4a3.2 3.2 0 0 0 3.2 3.2h8.4a3.2 3.2 0 0 0 3.2-3.2v-3.4",
    "M6.8 12.6V5.9a1.9 1.9 0 0 1 3.8 0",
    "m7.4 19.4-1.2 2.2",
    "m16.6 19.4 1.2 2.2",
  ],
  wifi: ["M2.9 9.1a13 13 0 0 1 18.2 0", "M6.1 12.5a8.4 8.4 0 0 1 11.8 0", "M9.3 15.9a4 4 0 0 1 5.4 0", "M12 19.3h.02"],
  ac: ["M3.2 6.2h17.6v6.2H3.2z", "M6 15v3.2", "M10 15v3.2", "M14 15v3.2", "M18 15v3.2"],
  parking: [
    "M4.2 16.6h15.6",
    "M6 16.6v2.2",
    "M18 16.6v2.2",
    "M4.6 16.6v-3.2l1.9-4.2h11l1.9 4.2v3.2",
    "M7.4 13.6h.02",
    "M16.6 13.6h.02",
  ],
  solar: [
    "M12 7.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8",
    "M12 2.6v2.2",
    "M12 19.2v2.2",
    "M2.6 12h2.2",
    "M19.2 12h2.2",
    "m5.5 5.5 1.6 1.6",
    "m16.9 16.9 1.6 1.6",
    "m18.5 5.5-1.6 1.6",
    "m7.1 16.9-1.6 1.6",
  ],
  security: ["M12 2.9 4.6 6v6.1c0 4.4 3.1 7.5 7.4 9 4.3-1.5 7.4-4.6 7.4-9V6z", "m8.9 12 2.2 2.2 4-4.4"],
} as const;

export type IconName = keyof typeof ICONS;
export type Spec = { label: string; icon: IconName };

/** The three specs overlaid on apartment cards. */
export function cardSpecs(a: Apartment): Spec[] {
  return [
    { label: a.specs.area, icon: "area" },
    { label: a.specs.guests, icon: "guests" },
    { label: a.specs.beds, icon: "bed" },
  ];
}

/** Full spec row on the detail page: base specs plus amenity-derived extras. */
export function fullSpecs(a: Apartment): Spec[] {
  const has = (re: RegExp) => a.amenities.some((x) => re.test(x));
  const extras: (Spec & { on: boolean })[] = [
    { on: has(/wifi/i), label: "Fibre wifi", icon: "wifi" },
    { on: has(/\bAC\b|air condition/i), label: "Air conditioning", icon: "ac" },
    {
      on: has(/parking|bay/i),
      label: has(/secure|compound/i) ? "Secure parking" : "Parking",
      icon: "parking",
    },
    { on: has(/solar|generator|inverter|backup power/i), label: "Power backup", icon: "solar" },
    { on: has(/security|gated/i), label: "24-hour security", icon: "security" },
  ];
  return [
    { label: a.specs.area, icon: "area" as const },
    { label: a.specs.guests, icon: "guests" as const },
    { label: a.specs.beds, icon: "bed" as const },
    { label: a.specs.baths, icon: "bath" as const },
    ...extras.filter((x) => x.on).map(({ label, icon }) => ({ label, icon })),
  ];
}

/** Amenities list minus the ones already shown as specs. */
export function listedAmenities(a: Apartment): string[] {
  const drop = /wifi|parking|bay|solar|generator|inverter|backup power|security|air condition/i;
  return a.amenities.filter((x) => !drop.test(x));
}

export type ServiceCategory = "Services" | "Neighbourhood";
export type Service = {
  cat: ServiceCategory;
  title: string;
  meta: string;
  body: string;
  /** Label for things without a fee, e.g. "Nearby". */
  price: string;
  /** Fee for the whole stay in USD (prices are stored in USD), added to the total when the guest picks it. */
  amount?: number;
  image: string;
};

/** "USD 8 per stay" for a paid extra, or the plain label (e.g. "Nearby"). */
export function servicePrice(s: Service, money: (usd: number) => string) {
  return s.amount ? `${money(s.amount)} per stay` : s.price;
}

/** Fee for each extra service, in Ugandan shillings. */
const EXTRA_FEE_UGX = 20000;
const extraFee = EXTRA_FEE_UGX / SITE.pricing.ugxRate;

export const SERVICES: Service[] = [
  {
    cat: "Services",
    title: "Laundry Services",
    meta: "Washed, dried and folded",
    body: "Keep your wardrobe fresh without the hassle during your stay. Washed, dried and folded for you.",
    price: "",
    amount: extraFee,
    image: "https://images.pexels.com/photos/6492065/pexels-photo-6492065.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    cat: "Services",
    title: "Cleaning Services",
    meta: "Mid-stay clean",
    body: "A fresh, tidy space throughout your stay, so your room is always comfortable and well-maintained.",
    price: "",
    amount: extraFee,
    image: "https://images.pexels.com/photos/29006838/pexels-photo-29006838.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    cat: "Services",
    title: "Car Wash Service",
    meta: "Wash and dry",
    body: `Keep your vehicle spotless while you relax at ${SITE.name}.`,
    price: "",
    amount: extraFee,
    image: "https://images.pexels.com/photos/4870724/pexels-photo-4870724.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    cat: "Neighbourhood",
    title: "Supermarket",
    meta: "Shopping · short walk",
    body: "A well-stocked supermarket is a short walk away for essentials, snacks or fresh ingredients.",
    price: "Nearby",
    image: "/images/svc-supermarket.jpg",
  },
  {
    cat: "Neighbourhood",
    title: "Easy Access",
    meta: "Location · major roads nearby",
    body: `A well-connected neighbourhood, with major roads and transport close by for ${SITE.location.area} and beyond.`,
    price: "Nearby",
    image: "/images/svc-access.jpg",
  },
  {
    cat: "Neighbourhood",
    title: "Hangouts",
    meta: "Proximity · cafés & outdoor spots",
    body: "Plenty of spots to relax, meet friends or enjoy the neighbourhood, from cosy cafés to lively outdoor spaces.",
    price: "Nearby",
    image: "/images/svc-hangouts.jpg",
  },
];

export const SERVICE_FILTERS = ["Everything", "Services", "Neighbourhood"] as const;

export const NAV_ITEMS = [
  { label: "Rooms", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Trips", href: "/trips" },
  { label: "Contact", href: "/contact" },
  { label: "Policies", href: "/policies" },
] as const;

export const PERKS = [
  { mark: "01", title: "Hotel-grade linens", body: "Percale sheets, six towels per guest, laundered off-site between every stay." },
  { mark: "02", title: "Stocked kitchen", body: "Local coffee, tea, sugar, oil and breakfast basics waiting when you arrive." },
  { mark: "03", title: "Self check-in", body: "A gate and door code that is yours alone, active from 2pm on arrival day." },
  { mark: "04", title: "Host on call", body: "A real person, one text away, from 7am to 10pm every day of your stay." },
];

// Sample review: replace with real guest reviews.
export const REVIEWS = [
  {
    quote:
      "Spotless, quiet and beautifully kept. We slept better here than at home.",
    who: "Sample guest · Business traveller",
  },
];

export const FAQS = [
  {
    q: "What's the cancellation policy?",
    a: "Free cancellation up to 7 days before arrival. Within 7 days a 50% charge applies; within 3 days, or a no-show, the full booking is charged. Group bookings of three rooms or more need 30 days' notice, and promotional rates are final.",
  },
  {
    q: "How do refunds work?",
    a: "7+ days before arrival: full refund. 3–7 days: 50% refund. Within 3 days or no-show: non-refundable. Refunds go back to the original payment method within 7–14 business days.",
  },
  {
    q: "Can I change my dates or leave early?",
    a: "Date changes are welcome, subject to availability — changes within 7 days of arrival count as a cancellation and rebooking. Early departures are charged the full original reservation.",
  },
  {
    q: "What are the house rules?",
    a: "We are intentionally quiet and reflective: no parties or loud gatherings, please respect other guests and the environment, and observe check-in/check-out times and any pet or smoking rules.",
  },
];

export const STATS = [
  { n: "3", label: "Kampala neighbourhoods: Kyebando, Ntinda and Kisasi" },
  { n: "150k", label: "UGX per night, nothing added" },
  { n: "24/7", label: "Security at every home" },
  { n: "Free", label: "WiFi and Netflix" },
];

export const TIMELINE = [
  {
    year: "What",
    title: "Fully furnished homes",
    body: "Modern kitchens with a cooker, oven, fridge and microwave, smart TVs with Netflix, hot water and free WiFi.",
  },
  {
    year: "Who",
    title: "Who we welcome",
    body: "Business travellers, families visiting Kampala, people between homes, and anyone who wants a quiet, secure place to stay.",
  },
  { year: "Where", title: "Three neighbourhoods", body: "Kyebando, Ntinda and Kisasi: residential, secure, and close to the city." },
  {
    year: "Style",
    title: "Comfort meets elegance",
    body: "Warm, well-kept rooms with ample secure parking and laundry available on request.",
  },
];

export const CONTACT_CARDS: { label: string; value: string; note: string; email?: string; phones?: boolean }[] = [
  {
    label: "Direct reservations",
    value: SITE.contact.phones.join(" · "),
    phones: true,
    note: `Call to book, WhatsApp ${SITE.contact.whatsapp}, or email us.`,
    email: CONFIG.reservationsEmail,
  },
  { label: "Email", value: CONFIG.email, note: "For general enquiries and group stays.", email: CONFIG.email },
  { label: "Address", value: SITE_PLACE, note: `${SITE.name}, ${SITE.location.country}.` },
  {
    label: "Approximate travel time",
    value: SITE.location.travel,
    note: "Close enough to get around, far enough to switch off.",
  },
];

export const BANK_ROWS = [
  { label: "Bank", value: SITE.payments.bank.name },
  { label: "Account name", value: SITE.payments.bank.accountName },
  { label: "Account number", value: SITE.payments.bank.accountNumber },
  { label: "Branch / SWIFT", value: SITE.payments.bank.branch },
];

export type PayMethod = "Mobile Money" | "Bank transfer" | "Card" | "Apple Pay" | "PayPal";

export const PAY_METHODS: { label: PayMethod; note: string; tag?: string; off?: boolean }[] = [
  { label: "Mobile Money", note: `${SITE.payments.momo.map((m) => `${m.network} ${m.number}`).join(" or ")} — ${SITE.payments.momoName}`, tag: "Recommended" },
  { label: "Bank transfer", note: "Direct bank transfer — details below" },
  { label: "Card", note: "DPO Pay (Visa & Mastercard) — coming soon", off: true },
  { label: "Apple Pay", note: "Coming soon", off: true },
  { label: "PayPal", note: "Coming soon", off: true },
];
