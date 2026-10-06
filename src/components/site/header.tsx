"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { displayName, useAuth } from "@/context/auth-context";
import { useBooking } from "@/context/booking-context";
import { useUI } from "@/context/ui-context";
import { datesLabel, guestsLabel, isoDate } from "@/lib/booking";
import { APARTMENTS, CONFIG, NAV_ITEMS } from "@/lib/data";
import { telHref } from "@/components/site/ui";
import { cn } from "@/lib/utils";
import { SITE, SITE_PLACE } from "@site";

const iconBtn =
  "relative grid h-[38px] w-[clamp(30px,8vw,38px)] flex-none place-items-center text-stone-700 transition-colors hover:text-brand group-data-[over=true]/hdr:text-stone-50 group-data-[over=true]/hdr:hover:text-brand-soft";

/** True once the page has scrolled past the very top. */
function useScrolled(threshold = 8) {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("scroll", cb, { passive: true });
      return () => window.removeEventListener("scroll", cb);
    },
    () => window.scrollY > threshold,
    () => false,
  );
}
// Header panels: a centred sheet on phones (the trigger isn't at the screen
// edge, so an anchored panel could run off-screen), anchored below the icon
// from 640px up.
const panelCls = cn(
  "fixed top-[72px] left-1/2 z-90 max-h-[calc(100vh-96px)] -translate-x-1/2 animate-sheet-in overflow-y-auto rounded-[6px] border border-stone-200 bg-white shadow-panel",
  "sm:absolute sm:top-[46px] sm:right-0 sm:left-auto sm:z-50 sm:max-h-none sm:translate-x-0 sm:overflow-hidden",
);

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/apartments") || pathname.startsWith("/checkout");
  return pathname.startsWith(href);
}

/**
 * Transparent at the top of the page, frosted glass once scrolled. On the home
 * page it floats over the full-bleed hero photo with white text until scrolled.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const home = pathname === "/";
  const overHero = home && !scrolled;

  return (
    <header
      data-over={overHero}
      className={cn(
        "group/hdr top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        home ? "fixed inset-x-0" : "sticky",
        scrolled ? "border-stone-200 bg-stone-50/85 backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      {/* The header runs wider than the page content (see w-header in globals.css). */}
      <div className="mx-auto flex min-h-[68px] w-header items-center gap-[clamp(10px,2vw,28px)]">
        <Link
          href="/"
          className="mr-1 flex min-w-0 items-center gap-[9px] text-stone-900 transition-colors hover:text-stone-900 group-data-[over=true]/hdr:text-stone-50"
        >
          <Image
            src={SITE.logo}
            alt=""
            width={26}
            height={26}
            className="size-[26px] object-contain group-data-[over=true]/hdr:brightness-0 group-data-[over=true]/hdr:invert"
            priority
          />
          <span className="font-display whitespace-nowrap text-[clamp(17px,3.4vw,22px)] tracking-[-.01em]">
            {SITE.wordmark}
          </span>
        </Link>

        <nav className="ml-auto hidden flex-nowrap gap-1.5 overflow-hidden xl:flex" aria-label="Main">
          {NAV_ITEMS.map((n) => {
            const on = isActive(n.href, pathname);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex h-[34px] items-center border-b-2 px-2.5 text-sm",
                  on
                    ? "border-brand font-semibold text-brand group-data-[over=true]/hdr:border-brand-soft group-data-[over=true]/hdr:text-brand-soft"
                    : "border-transparent text-stone-600 hover:text-stone-900 group-data-[over=true]/hdr:text-stone-50/85 group-data-[over=true]/hdr:hover:text-stone-50",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex flex-none items-center gap-[clamp(2px,1.5vw,10px)]">
          <CartMenu />
          <AccountMenu />
          <Link
            href="/#stays"
            className="hidden h-[38px] flex-none items-center whitespace-nowrap rounded-[4px] bg-brand px-[clamp(12px,3vw,18px)] text-[11.5px] font-semibold uppercase tracking-[.14em] text-stone-50 hover:bg-brand-hover hover:text-stone-50 sm:inline-flex"
          >
            <span className="md:hidden">Book</span>
            <span className="hidden md:inline">Book a stay</span>
          </Link>
          <Drawer />
        </div>
      </div>
    </header>
  );
}


const personIcon = (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8.2" r="3.9" />
    <path d="M4.6 20.2a7.4 7.4 0 0 1 14.8 0" />
  </svg>
);

/**
 * Signed out: opens the sign-in modal. Signed in: initial avatar with an
 * account menu. Without Supabase configured it says sign-in is coming soon.
 */
function AccountMenu() {
  const { panel, togglePanel, closePanels } = useUI();
  const { enabled, user, isAdmin, openAuth, signOut } = useAuth();
  const { orders } = useBooking();
  const open = panel === "account";

  if (enabled && !user) {
    return (
      <button type="button" onClick={() => openAuth("signin")} aria-label="Sign in" className={iconBtn}>
        {personIcon}
      </button>
    );
  }

  const name = user ? displayName(user) : "";
  const since = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : null;
  const today = isoDate(new Date());
  const nextStay = orders
    .filter((o) => (o.status === "pending" || o.status === "confirmed") && o.checkIn && o.checkIn >= today)
    .sort((a, b) => (a.checkIn ?? "").localeCompare(b.checkIn ?? ""))[0];
  const liveTrips = orders.filter((o) => o.status !== "cancelled" && o.status !== "declined").length;
  const row =
    "group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[14px] text-stone-900 transition-colors hover:bg-brand-tint hover:text-stone-900";
  const rowIcon = "grid size-9 flex-none place-items-center rounded-full bg-stone-100 text-stone-700 transition-colors group-hover:bg-white group-hover:text-brand";
  const chevron = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="ml-auto flex-none text-stone-300 group-hover:text-brand" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );

  return (
    <div className="relative flex-none" data-keep-open>
      <button
        type="button"
        onClick={() => togglePanel("account")}
        aria-label="Account"
        aria-expanded={open}
        className={user ? "ml-1 grid size-8 flex-none place-items-center rounded-full bg-brand text-[13.5px] font-medium uppercase leading-none text-stone-50 ring-2 ring-white/70 hover:bg-brand-hover" : iconBtn}
      >
        {user ? name.charAt(0) : personIcon}
      </button>
      {open && (
        <div className={cn(panelCls, "w-[min(380px,calc(100vw-24px))] sm:w-[min(390px,calc(100vw-28px))]")}>
          {user ? (
            <>
              {/* Photo banner with the guest's initial overlapping it. */}
              <div className="relative h-[190px] overflow-hidden">
                <Image src="/images/hero-balcony.jpg" alt="" fill sizes="400px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/10 to-stone-900/25" />
                <div className="absolute top-3 right-3.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.14em] text-stone-50/90">
                  <Image src={SITE.logo} alt="" width={16} height={16} className="size-4 object-contain brightness-0 invert" />
                  Guest
                </div>
              </div>
              <div className="px-4">
                <div className="relative -mt-8 grid size-16 place-items-center rounded-full bg-brand text-[26px] font-medium uppercase leading-none text-stone-50 ring-4 ring-white">
                  {name.charAt(0)}
                </div>
                <div className="mt-2.5 truncate font-display text-[21px] leading-tight">{name}</div>
                <div className="mt-0.5 truncate text-[13px] text-stone-500">{user.email}</div>
                {since && <div className="mt-1 text-[12px] text-stone-400">Guest since {since}</div>}
              </div>

              {nextStay ? (
                <Link
                  href="/trips"
                  onClick={closePanels}
                  className="mx-3 mt-4 block rounded-md border border-brand-soft bg-brand-tint px-3.5 py-3 hover:border-brand"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[.14em] text-brand">Your next stay</div>
                  <div className="mt-1 text-[14px] font-medium text-stone-900">{nextStay.apartment}</div>
                  <div className="mt-0.5 text-[12.5px] text-stone-600">
                    {datesLabel(nextStay.checkIn, nextStay.checkOut)} · {guestsLabel(nextStay.guests)}
                  </div>
                </Link>
              ) : (
                <Link
                  href="/#stays"
                  onClick={closePanels}
                  className="mx-3 mt-4 block rounded-md border border-brand-soft bg-brand-tint px-3.5 py-3 hover:border-brand"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[.14em] text-brand">Plan your stay</div>
                  <div className="mt-1 text-[13.5px] leading-[1.45] text-stone-700">
                    No upcoming stays yet. Pick your dates and we&apos;ll hold an apartment for you.
                  </div>
                </Link>
              )}

              <nav className="grid gap-0.5 p-2 pt-3" aria-label="Account">
                <Link href="/trips" onClick={closePanels} className={row}>
                  <span className={rowIcon}>
                    <TripsIcon />
                  </span>
                  Your trips
                  {liveTrips > 0 && (
                    <span className="ml-auto rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold text-stone-50">{liveTrips}</span>
                  )}
                  {liveTrips === 0 && chevron}
                </Link>
                <Link href="/contact" onClick={closePanels} className={row}>
                  <span className={rowIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 12a8.5 8.5 0 0 1-12.4 7.6L3 21l1.4-5.6A8.5 8.5 0 1 1 21 12z" />
                    </svg>
                  </span>
                  Talk to your host
                  {chevron}
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={closePanels} className={row}>
                    <span className={rowIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 2.9 4.6 6v6.1c0 4.4 3.1 7.5 7.4 9 4.3-1.5 7.4-4.6 7.4-9V6z" />
                      </svg>
                    </span>
                    Admin console
                    {chevron}
                  </Link>
                )}
              </nav>

              <div className="border-t border-stone-100 p-2">
                <button
                  type="button"
                  onClick={() => {
                    closePanels();
                    void signOut();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-stone-500 transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
                    <path d="M10 17l-5-5 5-5" />
                    <path d="M5 12h11" />
                  </svg>
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="border-b border-stone-100 px-4 py-3.5">
                <div className="text-[13.5px] font-semibold">Your account</div>
                <div className="mt-1 text-[12.5px] leading-[1.5] text-stone-500">
                  Sign-in is coming soon. Your trips are saved on this device for now.
                </div>
              </div>
              <Link
                href="/trips"
                onClick={closePanels}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-[13.5px] text-stone-900 hover:bg-stone-50 hover:text-stone-900"
              >
                <TripsIcon />
                Your trips
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function TripsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M8 6V4h8v2" />
    </svg>
  );
}

function CartMenu() {
  const { panel, togglePanel, closePanels, openPanel, openPanelAfterNav, toast } = useUI();
  const { cartItems, toggleCartItem, checkIn, checkOut } = useBooking();
  const router = useRouter();
  const pathname = usePathname();
  const open = panel === "cart";
  const count = cartItems.length;

  const checkout = () => {
    closePanels();
    if (!checkIn || !checkOut) {
      toast("warn", "Add your dates", "Pick check-in and check-out, then we'll add the extras to your booking.");
      if (pathname === "/") {
        openPanel("cal-hero");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        openPanelAfterNav("cal-hero");
        router.push("/");
      }
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="relative flex-none" data-keep-open>
      <button type="button" onClick={() => togglePanel("cart")} aria-label="Your trip extras" aria-expanded={open} className={iconBtn}>
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 4h1.8l2 10.2h11L20 7H5.4" />
          <circle cx="9" cy="19.2" r="1.5" />
          <circle cx="17.2" cy="19.2" r="1.5" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-[3px] -right-1 grid h-[17px] min-w-[17px] place-items-center rounded-full border-2 border-stone-50 bg-brand px-1 text-[10.5px] font-bold text-stone-50">
            {count}
          </span>
        )}
      </button>
      {open && (
        <div className={cn(panelCls, "w-[min(360px,calc(100vw-24px))] sm:w-[min(340px,calc(100vw-28px))]")}>
          <div className="border-b border-stone-100 px-4 py-3.5 text-[13px] font-semibold">Your trip extras</div>
          {count === 0 && (
            <div className="px-4 py-[22px] text-[13.5px] leading-[1.55] text-stone-500">
              Nothing added yet. Browse Services to add laundry, cleaning or a car wash to your stay.
            </div>
          )}
          {cartItems.map((c) => (
            <div key={c.title} className="flex items-start gap-2.5 border-b border-stone-100 px-4 py-[13px]">
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-medium leading-[1.35]">{c.title}</div>
                <div className="mt-[3px] text-[12.5px] text-stone-500">
                  {c.cat} · {c.meta}
                </div>
              </div>
              <div className="whitespace-nowrap text-[13px] font-semibold">{c.price}</div>
              <button
                type="button"
                onClick={() => toggleCartItem(c.title)}
                aria-label={`Remove ${c.title}`}
                className="px-0.5 text-[15px] leading-none text-stone-400 hover:text-stone-900"
              >
                ×
              </button>
            </div>
          ))}
          <div className="grid gap-2.5 px-4 py-3.5">
            <div className="flex justify-between gap-3 text-[13px] text-stone-600">
              <span>Extras subtotal</span>
              <span className="text-right font-semibold text-stone-900">Quoted on booking</span>
            </div>
            <button
              type="button"
              onClick={checkout}
              className="h-10 rounded-[10px] bg-brand text-[13.5px] font-medium text-stone-50 hover:bg-brand-hover"
            >
              Go to checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Drawer() {
  const { panel, togglePanel, closePanels } = useUI();
  const { money } = useBooking();
  const open = panel === "drawer";

  return (
    <div className="flex-none" data-keep-open>
      <button
        type="button"
        onClick={() => togglePanel("drawer")}
        aria-label={`About ${SITE.name}`}
        aria-expanded={open}
        className="ml-[clamp(2px,1vw,8px)] grid h-11 w-[clamp(34px,8vw,70px)] flex-none place-items-center text-stone-700 transition-colors hover:text-brand group-data-[over=true]/hdr:text-stone-50 group-data-[over=true]/hdr:hover:text-brand-soft"
      >
        <svg width="100%" height="26" viewBox="0 0 66 26" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="0.9">
          <path d="M0 7h66" vectorEffect="non-scaling-stroke" />
          <path d="M0 19h66" vectorEffect="non-scaling-stroke" />
        </svg>
      </button>
      {open &&
        createPortal(
        <div
          data-keep-open
          role="dialog"
          aria-label={SITE.name}
          className="fixed top-0 right-0 z-80 h-screen w-[50vw] animate-sheet-in xl:w-[35vw] mportrait:w-screen overflow-y-auto bg-brand px-[clamp(20px,5vw,34px)] pt-[clamp(22px,5vw,36px)] pb-[100px] text-stone-50 shadow-[-24px_0_60px_-20px_rgba(28,25,23,.45)]"
        >
          {/* Full-bleed room photo across the top (negative margins cancel the panel padding), darkened
              so the white logo and close button read on top of it. */}
          <div className="relative -mx-[clamp(20px,5vw,34px)] -mt-[clamp(22px,5vw,36px)] h-[clamp(300px,46svh,440px)] overflow-hidden bg-stone-900">
            <Image
              src="/images/room1-bedroom.jpg"
              alt={`A ${SITE.name} bedroom`}
              fill
              priority
              sizes="(max-width: 600px) and (orientation: portrait) 100vw, (min-width: 1000px) 35vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/45 to-stone-900/70" />
            <button
              type="button"
              onClick={closePanels}
              aria-label="Close"
              className="absolute top-[clamp(14px,3vw,24px)] right-[clamp(12px,3vw,24px)] z-10 grid size-11 place-items-center text-stone-50 hover:text-brand-soft"
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.9">
                <path d="M6 6 34 34" />
                <path d="M34 6 6 34" />
              </svg>
            </button>
            {/* The mark is gold artwork, rendered white so it shows on the dark photo. */}
            <Link
              href="/"
              onClick={closePanels}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-stone-50 hover:text-stone-50"
            >
              <Image
                src={SITE.logo}
                alt=""
                width={80}
                height={80}
                className="size-[clamp(56px,9vw,80px)] object-contain brightness-0 invert mportrait:size-[76px]"
              />
              {/* The panel's width follows the screen, so the name scales with it. */}
              <span className="font-display whitespace-nowrap text-[clamp(20px,2.6vw,30px)] mportrait:text-[30px]">{SITE.wordmark}</span>
            </Link>
          </div>

          <nav className="mt-[30px] grid gap-0.5 xl:hidden" aria-label="Menu">
            {NAV_ITEMS.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={closePanels}
                className="font-display py-2.5 text-[27px] text-stone-50 hover:text-brand-soft"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden xl:block">
            <div className="mt-[30px] text-[11px] font-semibold uppercase tracking-[.08em] text-brand-soft">
              Jump to an apartment
            </div>
            <div className="mt-2.5 grid">
              {APARTMENTS.map((a) => (
                <Link
                  key={a.id}
                  href={`/apartments/${a.id}`}
                  onClick={closePanels}
                  className="flex w-full items-baseline justify-between gap-3.5 border-b border-stone-50/15 py-[13px] text-stone-50 hover:text-brand-soft"
                >
                  <span className="min-w-0">
                    <span className="font-display block text-[21px] leading-[1.25]">{a.name}</span>
                    <span className="mt-[3px] block text-[12.5px] text-stone-50/80">{a.sleeps}</span>
                  </span>
                  <span className="whitespace-nowrap text-[13.5px] font-semibold">{money(a.price)} / night</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="my-[30px] h-px bg-stone-50/20" />
          <div className="text-[11px] font-semibold uppercase tracking-[.08em] text-brand-soft">Where we are</div>
          <div className="mt-[9px] text-base font-medium">{SITE_PLACE}</div>
          <div className="mt-1.5 text-sm leading-[1.6] text-stone-50/80">
            {SITE.location.travel} — close enough to get around, far enough to switch off.
          </div>
          <div className="mt-[26px] text-[14.5px] leading-[1.7] text-brand-tint">
            {SITE.name} — {SITE.tagline.charAt(0).toLowerCase() + SITE.tagline.slice(1)}
          </div>
          <div className="mt-7 grid gap-1.5">
            {CONFIG.phones.map((p) => (
              <a key={p} href={telHref(p)} onClick={() => togglePanel("drawer")} className="text-[15px] text-stone-50">
                {p}
              </a>
            ))}
            <a href={`mailto:${CONFIG.email}`} onClick={() => togglePanel("drawer")} className="text-[15px] text-stone-50">
              {CONFIG.email}
            </a>
          </div>
        </div>,
          document.body,
        )}
    </div>
  );
}
