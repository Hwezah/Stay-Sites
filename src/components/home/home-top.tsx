"use client";

import { useState, useSyncExternalStore } from "react";

import { Hero } from "@/components/home/hero";
import { ApartmentCard } from "@/components/site/apartment-card";
import { Calendar } from "@/components/site/calendar";
import { Container, CurrencyToggle, Eyebrow, FieldLabel, GuestStepper, Tabs } from "@/components/site/ui";
import { useBooking } from "@/context/booking-context";
import { useUI } from "@/context/ui-context";
import { CONFIG, APARTMENTS, FILTERS } from "@/lib/data";
import { fmtDate, guestsLabel } from "@/lib/booking";
import { cn } from "@/lib/utils";

type Filter = (typeof FILTERS)[number];

function scrollToStays() {
  const el = document.getElementById("stays");
  if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
}

/**
 * True when the visitor arrived at #stays from a "Book a stay" / "Book a room" link. Clicks are recorded
 * directly (and handled here: see the scroll below). Before any click, on a fresh page load, the URL hash
 * decides.
 */
let lastClick: "book" | "home" | null = null;

function useArrivedToBook() {
  return useSyncExternalStore(
    (onChange) => {
      const onClick = (e: MouseEvent) => {
        const href = (e.target as Element | null)?.closest?.("a[href]")?.getAttribute("href") ?? "";
        if (href.endsWith("#stays")) {
          lastClick = "book";
          // We're on the home page (this component only renders there). Scroll ourselves: Next's <Link>
          // does nothing when the URL already ends in #stays.
          e.preventDefault();
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          document.getElementById("stays")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
          if (window.location.hash !== "#stays") window.history.pushState(null, "", "/#stays");
        } else if (href === "/") lastClick = "home";
        else return;
        onChange();
      };
      window.addEventListener("hashchange", onChange);
      document.addEventListener("click", onClick, true);
      return () => {
        window.removeEventListener("hashchange", onChange);
        document.removeEventListener("click", onClick, true);
      };
    },
    () => (lastClick ? lastClick === "book" : window.location.hash === "#stays"),
    () => false,
  );
}

export function HomeTop() {
  const fromBooking = useArrivedToBook();
  const { checkIn, checkOut, guests, currency } = useBooking();
  const { panel, togglePanel, closePanels, toast } = useUI();
  const [filter, setFilter] = useState<Filter>(FILTERS[0]);

  const visible = APARTMENTS.filter((a) => filter === FILTERS[0] || a.kind === filter);

  const search = () => {
    if (!checkIn || !checkOut) {
      togglePanel("cal-hero");
      toast("warn", "Pick your dates", "Choose a check-in and check-out to see live pricing.");
      return;
    }
    toast("ok", "Apartments available", `${fmtDate(checkIn)} – ${fmtDate(checkOut)} for ${guests} guests.`);
    scrollToStays();
  };

  return (
    <>
      {/* Full-bleed photo hero (80% of the screen on phones, full height elsewhere). */}
      <Hero />

      <section>
        <Container>
          {/* Booking bar: a 2×2 grid right under the photo on small screens; one row overlapping the photo's
              bottom edge from 1000px. */}
          <div className="relative z-10 -mx-[clamp(16px,4vw,24px)] grid grid-cols-2 border-b border-stone-200 bg-white xl:mx-0 xl:-mt-[60px] xl:grid-cols-[1fr_1fr_1fr_minmax(220px,auto)] xl:border-0 xl:shadow-panel">
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
              onClick={search}
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
        </Container>
      </section>

      <section data-reveal id="stays" className="scroll-mt-20">
        <Container className="pt-[clamp(44px,7vw,72px)]">
          <div data-m-center className="flex flex-wrap items-end justify-between gap-6">
            <div className="min-w-0">
              <Eyebrow>Stay with us</Eyebrow>
              <h2 className="font-display mt-2.5 text-[clamp(27px,5.2vw,40px)] tracking-[-.015em] text-balance">
                {fromBooking ? "Choose your apartment" : "Our apartments"}
              </h2>
            </div>
            <div data-m-center className="flex max-w-full min-w-0 flex-wrap items-center gap-3">
              <div data-m-center className="flex min-w-0 flex-wrap items-center gap-2">
                <CurrencyToggle />
                <span className="whitespace-nowrap text-[11.5px] text-stone-400">
                  {currency === "UGX"
                    ? `USh ${CONFIG.ugxRate.toLocaleString("en-US")} to $1`
                    : "Pay in USD or Ugandan shillings"}
                </span>
              </div>
              <Tabs options={FILTERS} value={filter} onChange={setFilter} />
            </div>
          </div>

          <div className="mt-7 grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-[22px]">
            {visible.length === 0 && (
              <div className="col-span-full rounded-lg border border-stone-200 bg-white px-7 py-10 text-center">
                <div className="text-base font-semibold">
                  No apartments match this filter.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFilter(FILTERS[0]);
                  }}
                  className="mt-[18px] h-10 rounded-[10px] bg-brand px-5 text-[13.5px] font-medium text-stone-50 hover:bg-brand-hover"
                >
                  Show all apartments
                </button>
              </div>
            )}
            {visible.map((a) => (
              <ApartmentCard key={a.id} apartment={a} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
