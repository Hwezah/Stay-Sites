"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useUI } from "@/context/ui-context";
import { cn } from "@/lib/utils";

/** The mobile book bar shows everywhere except the checkout flow. */
export function showsBookBar(pathname: string) {
  return !pathname.startsWith("/checkout");
}

/**
 * Bottom "Book a room" bar, phones only (< 640px). It slides in while the visitor scrolls, stays a few
 * seconds after they stop (longer while they're touching or focused on it), then slides away so it doesn't
 * take space. It stays put while the side menu or a side panel is open.
 */
export function BookBar() {
  const pathname = usePathname();
  const { panel, closePanels } = useUI();
  const atRooms = useRoomsInView(pathname);
  const [held, setHeld] = useState(false);
  const scrolled = useScrollActivity(pathname, held);
  if (!showsBookBar(pathname)) return null;
  const onBrand = panel === "drawer";
  // The side menu and the cart/account panels keep it showing for as long as they're open.
  const inPanel = panel === "drawer" || panel === "cart" || panel === "account";
  const shown = inPanel || scrolled;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-85 border-t px-3.5 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-200 ease-out motion-reduce:transition-none sm:hidden",
        onBrand ? "border-stone-50/20 bg-brand" : "border-stone-200 bg-stone-50/95",
        !shown && "pointer-events-none translate-y-full",
      )}
      aria-hidden={!shown || undefined}
      inert={!shown}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      data-keep-open
    >
      <Link
        href="/stays"
        // Close the menu (it stays open over the page on a same-page jump) before heading to the rooms.
        onClick={closePanels}
        data-m-btn
        className={cn(
          "flex min-h-12 w-full items-center justify-center rounded-md text-[15px] font-medium",
          onBrand ? "bg-stone-50 text-brand" : "bg-brand text-stone-50",
        )}
      >
        {pathname === "/stays" ? "Choose Your Apartment" : pathname === "/" && !atRooms ? "Book Your Stay" : pathname === "/" ? "Choose Your Apartment" : "Back To Apartments"}
      </Link>
    </div>
  );
}

const HIDE_AFTER_MS = 3000;

/** True while the page is scrolling and for a few seconds after; `held` keeps it true. Resets per page. */
function useScrollActivity(pathname: string, held: boolean) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      setActive(true);
      clearTimeout(timer);
      if (!held) timer = setTimeout(() => setActive(false), HIDE_AFTER_MS);
    };
    // Letting go of the bar starts the countdown again.
    if (!held) timer = setTimeout(() => setActive(false), HIDE_AFTER_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname, held]);
  return active;
}

/**
 * True while the home page's rooms section (#stays) fills the middle of the screen, so the bar can stop
 * saying "Book a room" once the visitor is already looking at the rooms.
 */
function useRoomsInView(pathname: string) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = pathname === "/" ? document.getElementById("stays") : null;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "-45% 0px -45% 0px",
    });
    io.observe(el);
    return () => {
      io.disconnect();
      setInView(false);
    };
  }, [pathname]);
  return inView;
}

/**
 * Page shell. On pages with the book bar it flags itself so the footer can add room at its own bottom
 * (in the footer's colour) for the bar, instead of leaving a blank strip under the footer.
 */
export function ShellPadding({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div data-bookbar={showsBookBar(pathname) || undefined} className="group/shell flex min-h-screen flex-col">
      {children}
    </div>
  );
}
