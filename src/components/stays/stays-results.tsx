"use client";

import Image from "next/image";
import Link from "next/link";

import { BookingBar } from "@/components/site/booking-bar";
import { Container } from "@/components/site/ui";
import { useBooking } from "@/context/booking-context";
import { datesLabel, guestsLabel } from "@/lib/booking";
import { APARTMENTS } from "@/lib/data";

/** Results page that "Book a Stay" opens: a short photo banner, the booking bar, then every apartment. */
export function StaysResults() {
  const { checkIn, checkOut, guests, money } = useBooking();
  const picked = checkIn && checkOut;

  return (
    <main>
      <section className="relative isolate flex h-[clamp(240px,38vh,380px)] items-end overflow-hidden bg-stone-900 text-stone-50">
        <Image src="/images/hero-balcony.jpg" alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-stone-900/50" />
        <div data-m-center className="mx-auto w-full max-w-[1400px] px-[clamp(16px,4vw,24px)] pb-[clamp(28px,5vw,96px)] text-center">
          <h1 className="font-display text-[clamp(38px,6vw,76px)] font-medium leading-none">Available apartments</h1>
          <p className="mt-3 text-[14px] uppercase tracking-[.16em] text-stone-50/85">
            {picked ? `${datesLabel(checkIn, checkOut)} · ${guestsLabel(guests)}` : "Pick your dates to see your total"}
          </p>
        </div>
      </section>

      <Container>
        <BookingBar overlap />
      </Container>

      <Container id="results" className="scroll-mt-24 pt-[clamp(32px,6vw,72px)] pb-24">
        <div className="grid gap-[clamp(28px,5vw,56px)]">
          {APARTMENTS.map((a) => (
            <article key={a.id} className="grid items-center gap-[clamp(20px,4vw,48px)] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <Link href={`/apartments/${a.id}`} className="relative block aspect-[4/3] overflow-hidden bg-stone-100">
                <Image
                  src={a.images[0]}
                  alt={a.name}
                  fill
                  sizes="(min-width: 760px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              </Link>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h2 className="font-display text-[clamp(28px,3.4vw,40px)] font-medium leading-tight">{a.name}</h2>
                  <div className="whitespace-nowrap">
                    <span className="text-[22px] font-semibold">{money(a.price)}</span>
                    <span className="text-[14px] text-stone-500"> / night</span>
                  </div>
                </div>
                <p className="mt-4 line-clamp-3 text-[15px] leading-[1.7] text-stone-600">{a.desc}</p>
                <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[14px]">
                  {[
                    ["Area", a.specs.area],
                    ["Bedrooms", a.specs.beds.replace(/\D+/g, "")],
                    ["Guests", a.specs.guests.replace(/\D+/g, "")],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-1.5">
                      <dt className="text-stone-500">{k}:</dt>
                      <dd className="text-stone-900">{v}</dd>
                    </div>
                  ))}
                </dl>
                <Link
                  href={`/apartments/${a.id}`}
                  className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-stone-900 hover:text-brand"
                >
                  View details
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </main>
  );
}
