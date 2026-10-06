"use client";

import { useState } from "react";

import { Hero } from "@/components/home/hero";
import { ApartmentCard } from "@/components/site/apartment-card";
import { BookingBar } from "@/components/site/booking-bar";
import { Container, CurrencyToggle, Eyebrow, Tabs } from "@/components/site/ui";
import { useBooking } from "@/context/booking-context";
import { CONFIG, APARTMENTS, FILTERS } from "@/lib/data";

type Filter = (typeof FILTERS)[number];

export function HomeTop() {
  const { currency } = useBooking();
  const [filter, setFilter] = useState<Filter>(FILTERS[0]);

  const visible = APARTMENTS.filter((a) => filter === FILTERS[0] || a.kind === filter);

  return (
    <>
      {/* Full-bleed photo hero (80% of the screen on phones, full height elsewhere). */}
      <Hero />

      <section>
        <Container>
          <BookingBar overlap />
        </Container>
      </section>

      <section data-reveal id="stays" className="scroll-mt-20">
        <Container className="pt-[clamp(44px,7vw,72px)]">
          <div data-m-center className="flex flex-wrap items-end justify-between gap-6">
            <div className="min-w-0">
              <Eyebrow>Stay with us</Eyebrow>
              <h2 className="font-display mt-2.5 text-[clamp(27px,5.2vw,40px)] tracking-[-.015em] text-balance">
                Our apartments
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
