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
 * Bottom "Book a room" bar, phones only (< 640px). It slides in once the visitor scrolls, so it doesn't take
 * space on the first screen, and stays put while the side menu is open.
 */
export function BookBar() {
  const pathname = usePathname();
  const { panel, closePanels } = useUI();
  const atRooms = useRoomsInView(pathname);
  const scrolled = useScrolled(pathname);
  if (!showsBookBar(pathname)) return null;
  const onBrand = panel === "drawer";
  const shown = onBrand || scrolled;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-85 border-t px-3.5 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 ease-out motion-reduce:transition-none sm:hidden",
        onBrand ? "border-stone-50/20 bg-brand" : "border-stone-200 bg-stone-50/95",
        !shown && "pointer-events-none translate-y-full",
      )}
      aria-hidden={!shown || undefined}
      inert={!shown}
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

/** True once the page has scrolled a little; resets on each new page. */
function useScrolled(pathname: string) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);
  return scrolled;
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

/** Adds bottom padding so the fixed book bar never covers page content. */
export function ShellPadding({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className={cn("flex min-h-screen flex-col", showsBookBar(pathname) && "pb-[84px] sm:pb-0")}>{children}</div>
  );
}
