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
        <div className={`relative z-10 -mx-[clamp(16px,4vw,24px)] grid grid-cols-2 border-b border-stone-200 bg-white xl:mx-0 ${overlap ? "xl:-mt-[60px]" : ""} xl:grid-cols-[1fr_1fr_1fr_minmax(220px,auto)] xl:border-0 xl:shadow-panel`}>
          {(["checkIn", "checkOut"] as const).map((k) => {
            const value = k === "checkIn" ? checkIn : checkOut;
            return (
              <button
                key={k}
                type="button"
                data-keep-open
                onClick={() => togglePanel("cal-hero")}
                className="min-w-0 border-r border-b border-stone-200 px-[clamp(16px,3vw,32px)] py-[clamp(16px,2.4vw,26px)] text-left transition-colors hover:bg-stone-50 xl:border-b-0"
              >
                <FieldLabel>{k === "checkIn" ? "Check in" : "Check out"}</FieldLabel>
                <div className={cn("font-display mt-1.5 truncate text-[clamp(19px,2vw,24px)]", value ? "text-stone-900" : "text-stone-500")}>
                  {value ? fmtDate(value) : "Select date"}
                </div>
              </button>
            );
          })}
          <div className="flex min-w-0 items-center justify-between gap-2 border-r border-stone-200 px-[clamp(16px,3vw,32px)] py-[clamp(16px,2.4vw,26px)]">
            <div className="min-w-0">
              <FieldLabel>Guests</FieldLabel>
              <div className="font-display mt-1.5 whitespace-nowrap text-[clamp(19px,2vw,24px)] text-stone-900">{guestsLabel(guests)}</div>
            </div>
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
