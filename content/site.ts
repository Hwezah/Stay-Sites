/**
 * Every business detail for this lodge site lives here. To set the template up for a new client,
 * edit this file (and swap the photos in /public/images); nothing else needs to change.
 */
export const SITE = {
  // Identity
  name: "Dukes Apartments",
  // Shown in the header and footer. Usually the same as `name`.
  wordmark: "Dukes Apartments",
  // Square line icon, drawn in the brand colour. Rendered white over photos.
  logo: "/brand/logo.svg",
  tagline: "Where comfort meets elegance. Fully furnished homes in Kyebando, Ntinda and Kisasi.",

  // Home page hero: one short line, it's set very large.
  hero: {
    headline: "Where comfort meets elegance.",
  },

  // Location
  location: {
    area: "Kyebando, Ntinda & Kisasi",
    city: "Kampala",
    country: "Uganda",
    // How long from the nearest centre, in plain words.
    travel: "Three Kampala neighbourhoods, close to the city",
  },

  // Contact. All phone numbers are tap-to-call; WhatsApp goes to `whatsapp` only.
  contact: {
    phones: ["+256 700 675 952"],
    whatsapp: "+256 700 675 952",
    email: "info@example.com",
    // Shown next to booking, checkout and payment steps.
    reservationsEmail: "info@example.com",
  },

  // The person guests deal with. Their photo is optional (leave it empty to show initials).
  host: {
    name: "Dukes Apartments",
    firstName: "Dukes",
    role: "Your hosts",
    email: "info@example.com",
    photo: "",
    quote:
      "Every Dukes home is fully furnished and ready to live in — modern kitchen, fast Wi-Fi, Netflix, round-the-clock security and plenty of parking. Just bring your bags.",
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
    currency: "UGX" as "USD" | "UGX",
    // Shillings per dollar, used for the UGX prices.
    ugxRate: 3750,
    cleaningFee: 0,
    serviceFeePct: 0,
    taxPct: 0,
  },

  // Mobile money numbers guests pay into, and the registered name.
  payments: {
    momo: [
      { network: "Airtel", number: "0700 675952", tel: "+256700675952" },
    ],
    momoName: "Dukes Apartments",
    bank: { name: "To confirm", accountName: "Dukes Apartments", accountNumber: "To confirm", branch: "To confirm" },
  },

  // Social links (leave a value empty to hide it).
  socials: {
    instagram: "",
    tiktok: "https://www.tiktok.com/@dukesapartments",
    facebook: "",
  },

  // Brand colours. `brand` is the main accent (buttons, links, highlights).
  theme: {
    brand: "#0F1C38",
    brandHover: "#1B2B4F",
    brandTint: "#E7EAF1",
    brandSoft: "#BFC7D9",
    page: "#F6F4EF",
    // Second, sparing accent: eyebrows, stars, active underlines and small rules.
    accent: "#C8A45C",
  },

  // Search engines and link previews
  seo: {
    title: "Dukes Apartments · Furnished homes in Kyebando, Ntinda & Kisasi, Kampala",
    description:
      "Fully furnished homes in Kyebando, Ntinda and Kisasi with a modern kitchen, Wi-Fi, TV with Netflix, 24/7 security and ample parking. Book on WhatsApp: +256 700 675 952.",
    ogImage: "https://images.pexels.com/photos/6580396/pexels-photo-6580396.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
} as const;

/** "Your Neighbourhood, Your City" */
export const SITE_PLACE = [SITE.location.area, SITE.location.city].filter(Boolean).join(", ");
