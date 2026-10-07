"use client";

import Image from "next/image";

import { BookingBar } from "@/components/site/booking-bar";
import { RoomRow } from "@/components/site/room-row";
import { Container } from "@/components/site/ui";
import { useBooking } from "@/context/booking-context";
import { datesLabel, guestsLabel } from "@/lib/booking";
import { APARTMENTS } from "@/lib/data";

/** Results page that "Book a Stay" opens: a short photo banner, the booking bar, then every apartment. */
export function StaysResults() {
  const { checkIn, checkOut, guests } = useBooking();
  const picked = checkIn && checkOut;

  return (
    <main>
      <section className="relative isolate flex min-h-[80svh] items-end overflow-hidden bg-stone-900 text-stone-50">
        <Image src="https://images.pexels.com/photos/6143348/pexels-photo-6143348.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-stone-900/50" />
        <div data-m-center className="mx-auto w-full max-w-[1400px] px-[clamp(16px,4vw,24px)] pb-[clamp(28px,5vw,96px)] text-center">
          <h1 className="font-display text-[clamp(38px,6vw,76px)] font-medium leading-none">Our spaces</h1>
          <p className="mt-3 text-[14px] uppercase tracking-[.16em] text-stone-50/85">
            {picked ? `${datesLabel(checkIn, checkOut)} · ${guestsLabel(guests)}` : "Pick your dates to see your total"}
          </p>
        </div>
      </section>

      <Container>
        <BookingBar overlap />
      </Container>

      <Container id="results" className="scroll-mt-24 pt-[clamp(32px,6vw,72px)] pb-24">
        <div className="grid gap-[clamp(40px,6vw,80px)]">
          {APARTMENTS.map((a, i) => (
            <RoomRow key={a.id} apartment={a} flip={i % 2 === 1} />
          ))}
        </div>
      </Container>
    </main>
  );
}
