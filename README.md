# Lodge template

A booking site template for lodges, guesthouses and serviced apartments. Each client gets their own branch
off `lodge-template` and their own Vercel project.

## Setting it up for a client

1. **`content/site.ts`:** name, wordmark, logo, tagline, hero text, location, phones, WhatsApp, emails,
   host, mobile money and bank details, socials, brand colours and SEO text. Nothing else holds business
   details.
2. **`public/brand/logo.svg`:** the client's logo (square, drawn in their brand colour). Update
   `src/app/icon.svg` and `src/app/apple-icon.png` to match.
3. **`public/images/`:** swap in the client's photos, keeping the file names (or update the paths in
   `src/lib/data.ts`, which also holds the apartments, amenities, services and FAQs).
4. **`src/app/policies/page.tsx`:** the client's cancellation policy and house rules.

> The room photos in `public/images/` are placeholders from a previous build. Replace them for every client.

**Stack:** Next.js 16 (App Router) · Tailwind CSS v4 · shadcn/ui · Supabase Auth · React Context for state.
Bookings move to the Supabase database next. No environment variables are required; auth switches on when
the Supabase keys are set.

## Getting started

```bash
npm install
npm run dev
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | Hero + search, photo collage, apartment cards, inclusions, reviews, FAQ |
| `/apartments/[id]` | Gallery, specs, amenities, booking card (calendar + price breakdown) |
| `/services` | Services & neighbourhood cards; add services to the trip cart |
| `/about`, `/contact` | Founder story, stats, vision; enquiry form (opens email) + contact cards |
| `/checkout` | Guest details, payment method (Mobile Money / bank), split pay, totals |
| `/checkout/pending` | Payment claim recorded, awaiting admin confirmation |
| `/checkout/done` | Confirmed booking (return target for card payments) |
| `/trips` | The guest's bookings, check-in details, message the host |
| `/admin` | Confirm or decline orders — Supabase sign-in + admin role (placeholder until Supabase keys are set) |
| `/auth/callback` | Completes Google sign-in, email confirmation and password-reset links |

## Where things live

```
src/
  app/                    routes (see above), layout, icons, metadata
  components/site/        header (cart, notifications, account, drawer), footer,
                          book bar, calendar, toaster, scroll reveal, shared UI
  components/booking/     booking card, checkout, pending, done, trips
  context/
    ui-context.tsx        toasts, notifications, which panel is open
    booking-context.tsx   trip draft (apartment, dates, guests, cart), currency,
                          checkout form, orders
  lib/
    supabase/             config (supabaseEnabled), browser + server clients, admin check
    data.ts               apartments, services, copy, config (till numbers, fees…)
    booking.ts            pricing, dates/calendar, currency, phone, WhatsApp helpers
public/images/            client photos (compressed JPEG)
```

**Breakpoints** match the prototype's width tiers and are defined in `globals.css`:
`xs` 520 · `sm` 640 · `md` 760 · `lg` 900 · `xl` 1000 · `2xl` 1400.

## Supabase Auth setup

1. Create a project at [supabase.com](https://supabase.com) (automatic RLS on). Copy the **Project URL** (just
   `https://<project-ref>.supabase.co`, no `/rest/v1/`) and the **publishable (anon) key** into
   `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, locally and in Vercel. In Vercel, add
   both as **Config** variables (they are public by design) and `ADMIN_EMAILS` as a **Secret**. Redeploy after
   changing them.
2. **Authentication → URL Configuration:** set *Site URL* to the primary domain (`https://www.selahlodges.com`)
   and add redirect URLs: `https://selahlodges.com/auth/callback`, `https://www.selahlodges.com/auth/callback`,
   `https://*.vercel.app/auth/callback` and `http://localhost:3000/auth/callback`.
3. **Authentication → Sign In / Providers → Google:** enable it with a Google Cloud OAuth client
   (authorised redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`). Email + password is on by
   default; keep "Confirm email" on.
4. **Clear sign-in errors** (SQL editor): run `supabase/migrations/20261005000000_auth_email_status.sql`. It lets
   the sign-in window say "no account for this email", "wrong password", "not confirmed yet" or "uses Google"
   instead of Supabase's generic "invalid login credentials". Without it the generic message shows.
5. **Make an admin** (SQL editor):
   ```sql
   update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'
   where email = 'owner@example.com';
   ```
   The user signs out and back in for it to apply. `ADMIN_EMAILS` works too.

## Screenshots at every breakpoint

```bash
npm run build && npm start
npm run capture   # writes screenshots/<width>/<route>.png
```

## Known limitations / next steps

- **Auth is off until the Supabase keys are set** (`src/lib/supabase/config.ts`). Without them the account menu
  says sign-in is coming soon and `/admin` shows a placeholder.
- **Orders live in the browser** (`localStorage`, `selah.*` keys). The admin console only sees orders made
  on the same device until bookings move to Supabase.
- **Blocked calendar days are a placeholder pattern** (`isBlocked` in `lib/booking.ts`) until real
  availability comes from the database.
- **SMS/email is not sent** — confirmations are notifications in the UI only.
- **Card payments (DPO Pay)** are shown as "coming soon"; see the handoff README for the integration plan.
