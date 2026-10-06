"use client";

import { usePathname, useRouter } from "next/navigation";

import { Calendar } from "@/components/site/calendar";
import { FieldLabel, GuestStepper } from "@/components/site/ui";
import { useBooking } from "@/context/booking-context";
import { useUI } from "@/context/ui-context";
import { fmtDate, guestsLabel } from "@/lib/booking";
import { cn } from "@/lib/utils";

/**
 * Check in / Check out / Guests / Book a Stay. A 2×2 grid on small screens; one row from 1000px, pulled up
 * over the photo above it when `overlap` is set. "Book a Stay" opens the results page (/stays).
 */
export function BookingBar({ overlap = false }: { overlap?: boolean }) {
  const { checkIn, checkOut, guests } = useBooking();
  const { panel, togglePanel, closePanels } = useUI();
  const router = useRouter();
  const pathname = usePathname();

  const book = () => {
    closePanels();
    if (pathname === "/stays") {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push("/stays");
  };

  return (
    <>
        <div className={`relative z-10 -mx-[clamp(16px,4vw,24px)] grid auto-rows-fr grid-cols-2 border-b border-stone-200 bg-white xl:mx-0 ${overlap ? "xl:-mt-[60px]" : ""} xl:grid-cols-[1fr_1fr_auto_minmax(180px,0.8fr)] xl:border-0 xl:shadow-panel`}>
          {(["checkIn", "checkOut"] as const).map((k) => {
            const value = k === "checkIn" ? checkIn : checkOut;
            const label = k === "checkIn" ? "Check in" : "Check out";
            return (
              <button
                key={k}
                type="button"
                data-keep-open
                onClick={() => togglePanel("cal-hero")}
                className="flex min-w-0 items-center justify-center border-r border-b border-stone-200 px-4 py-[clamp(18px,2.4vw,28px)] transition-colors hover:bg-stone-50 xl:border-b-0 mportrait:px-2.5"
              >
                {/* One line, centred in the cell, reading left to right: CHECK IN → Select date. */}
                <span className="flex min-w-0 items-center gap-3 text-left xl:gap-2.5 2xl:gap-3 mportrait:hidden">
                  <FieldLabel className="whitespace-nowrap">{label}</FieldLabel>
                  <Arrow />
                  <span className={cn("font-display truncate text-[clamp(19px,1.9vw,23px)]", value ? "text-stone-900" : "text-stone-500")}>
                    {value ? fmtDate(value) : "Select Date"}
                  </span>
                </span>
                {/* Phones held upright: one combined phrase. */}
                <span className={cn("font-display hidden truncate text-[clamp(15px,4.3vw,17px)] mportrait:inline", value ? "text-stone-900" : "text-stone-600")}>
                  {value ? `${label}: ${fmtDate(value)}` : `Select ${k === "checkIn" ? "Check In" : "Check Out"} Date`}
                </span>
              </button>
            );
          })}
          <div className="flex min-w-0 items-center justify-center gap-3 border-r border-stone-200 px-4 py-[clamp(18px,2.4vw,28px)] xl:px-6">
            <span className="flex min-w-0 items-center gap-3 text-left xl:gap-2.5 2xl:gap-3 mportrait:hidden">
              <FieldLabel className="whitespace-nowrap">Guests</FieldLabel>
              <Arrow />
              <span className="font-display whitespace-nowrap text-[clamp(19px,1.9vw,23px)] font-medium text-stone-900">{guestsLabel(guests)}</span>
            </span>
            <span className="font-display hidden whitespace-nowrap text-[17px] font-medium text-stone-900 mportrait:inline">
              {guests} {guests === 1 ? "Guest" : "Guests"}
            </span>
            <GuestStepper />
          </div>
          <button
            type="button"
            onClick={book}
            className="flex items-center justify-center bg-brand px-8 text-[15px] font-medium tracking-[.02em] text-stone-50 transition-colors hover:bg-brand-hover"
          >
            Book a Stay
          </button>
        </div>

        {panel === "cal-hero" && (
          <div className="mt-4 flex justify-center" data-keep-open>
            <div className="w-full max-w-[380px] animate-sheet-in rounded-lg border border-stone-200 bg-white p-4 shadow-panel">
              <Calendar onDone={closePanels} />
            </div>
          </div>
        )}
    </>
  );
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="flex-none text-brass" aria-hidden="true">
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </svg>
  );
}
