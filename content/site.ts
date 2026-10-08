/**
 * Every business detail for this lodge site lives here. To set the template up for a new client,
 * edit this file (and swap the photos in /public/images); nothing else needs to change.
 */
export const SITE = {
  // Identity
  name: "Airbnb Demo",
  // Shown in the header and footer. Usually the same as `name`.
  wordmark: "Airbnb Demo",
  // Square line icon, drawn in the brand colour. Rendered white over photos.
  logo: "/brand/logo.svg",
  tagline: "Quiet, beautifully kept apartments — close to the city, far from the noise.",

  // Home page hero: one short line, it's set very large.
  hero: {
    headline: "Rest easy. Stay a while.",
  },

  // Location
  location: {
    area: "Location",
    // Optional; leave empty to show the area alone.
    city: "",
    country: "Uganda",
    // How long from the nearest centre, in plain words.
    travel: "20 minutes from the city centre",
  },

  // Contact. All phone numbers are tap-to-call; WhatsApp goes to `whatsapp` only.
  contact: {
    phones: ["+25600000000"],
    whatsapp: "+25600000000",
    email: "info@example.com",
    // Shown next to booking, checkout and payment steps.
    reservationsEmail: "info@example.com",
  },

  // The person guests deal with. Their photo is optional (leave it empty to show initials).
  host: {
    name: "Admin",
    firstName: "Admin",
    role: "Owner & host",
    email: "info@example.com",
    photo: "",
    quote:
      "We built this place for travellers who want a quiet, comfortable base — somewhere that feels looked after from the moment you arrive.",
  },

  // House details shown on every apartment page under "Good to know".
  house: {
    checkIn: "From 2:00 pm",
    checkOut: "By 11:00 am",
    pets: "On request",
    smoking: "No",
    children: "Welcome",
    parties: "No",
    note: "Free cancellation up to 7 days before arrival. See our policies for the full terms.",
  },

  // Optional charges added to every booking. Leave at 0 to show just nights × nightly rate.
  pricing: {
    // Currency the site opens in ("USD" or "UGX"); nightly prices in src/lib/data.ts are in USD.
    currency: "USD" as "USD" | "UGX",
    // Shillings per dollar, used for the UGX prices.
    ugxRate: 3800,
    cleaningFee: 0,
    serviceFeePct: 0,
    taxPct: 0,
  },

  // Mobile money numbers guests pay into, and the registered name.
  payments: {
    momo: [
      { network: "MTN", number: "+25600000000", tel: "+25600000000" },
    ],
    momoName: "Admin",
    bank: { name: "To confirm", accountName: "Airbnb Demo", accountNumber: "To confirm", branch: "To confirm" },
  },

  // Social links (leave a value empty to hide it).
  socials: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    facebook: "",
  },

  // Brand colours. `brand` is the main accent (buttons, links, highlights).
  theme: {
    brand: "#0A1428",
    brandHover: "#16233F",
    brandTint: "#E6E9F0",
    brandSoft: "#BCC4D6",
    page: "#F4F4F1",
    // Second, sparing accent: eyebrows, stars, active underlines and small rules.
    accent: "#B08D57",
  },

  // Search engines and link previews
  seo: {
    title: "Airbnb Demo · Serviced apartments",
    description:
      "Quiet, fully furnished one-bed apartments with self check-in, fast Wi-Fi and a host on call — 20 minutes from the city centre.",
    ogImage: "https://images.pexels.com/photos/6580396/pexels-photo-6580396.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
} as const;

/** "Area, City", or just the area when no city is set. */
export const SITE_PLACE = [SITE.location.area, SITE.location.city].filter(Boolean).join(", ");
