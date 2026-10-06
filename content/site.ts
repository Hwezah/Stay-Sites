/**
 * Every business detail for this lodge site lives here. To set the template up for a new client,
 * edit this file (and swap the photos in /public/images); nothing else needs to change.
 */
export const SITE = {
  // Identity
  name: "Example Lodge",
  // Shown in the header and footer. Usually the same as `name`.
  wordmark: "Example Lodge",
  // Square line icon, drawn in the brand colour. Rendered white over photos.
  logo: "/brand/logo.svg",
  tagline: "A calm place to rest, recharge and explore.",

  // Home page hero
  hero: {
    headline: "Your calm, comfortable base in the city.",
    intro: "Fully furnished one-bed apartments in a quiet neighbourhood — 20 minutes from the city centre.",
  },

  // Location
  location: {
    area: "Your Neighbourhood",
    city: "Your City",
    country: "Uganda",
    // How long from the nearest centre, in plain words.
    travel: "20 minutes from the city centre",
  },

  // Contact. All phone numbers are tap-to-call; WhatsApp goes to `whatsapp` only.
  contact: {
    phones: ["+256 700 000 000", "+256 700 000 001"],
    whatsapp: "+256 700 000 001",
    email: "info@example.com",
    // Shown next to booking, checkout and payment steps.
    reservationsEmail: "info@example.com",
  },

  // The person guests deal with. Their photo is optional (leave it empty to show initials).
  host: {
    name: "Alex Morgan",
    firstName: "Alex",
    role: "Owner & host",
    email: "info@example.com",
    photo: "",
    quote:
      "We built this place for travellers who want a quiet, comfortable base — somewhere that feels looked after from the moment you arrive.",
  },

  // Mobile money numbers guests pay into, and the registered name.
  payments: {
    momo: [
      { network: "MTN", number: "0700 000000", tel: "+256700000000" },
      { network: "Airtel", number: "0700 000001", tel: "+256700000001" },
    ],
    momoName: "Account holder name",
    bank: { name: "To confirm", accountName: "Example Lodge Ltd", accountNumber: "To confirm", branch: "To confirm" },
  },

  // Social links (leave a value empty to hide it).
  socials: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    facebook: "",
  },

  // Brand colours. `brand` is the main accent (buttons, links, highlights).
  theme: {
    brand: "#2F5D50",
    brandHover: "#244A3F",
    brandTint: "#E6EEE9",
    brandSoft: "#C7D9CF",
    page: "#F3F0E9",
  },

  // Search engines and link previews
  seo: {
    title: "Example Lodge · Serviced apartments in Your City",
    description:
      "Comfortable, fully furnished one-bed apartments in a quiet neighbourhood — 20 minutes from the city centre.",
    ogImage: "/images/hero-living.jpg",
  },
} as const;

/** "Your Neighbourhood, Your City" */
export const SITE_PLACE = `${SITE.location.area}, ${SITE.location.city}`;
