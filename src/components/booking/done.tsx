"use client";

import Image from "next/image";
import Link from "next/link";

import { useBooking } from "@/context/booking-context";
import { datesLabel, guestsLabel } from "@/lib/booking";
import { getApartment } from "@/lib/data";
import { downloadIcs } from "@/lib/ics";
import { SITE } from "@site";

/** Confirmation screen — the return target once card payments (DPO) go live. */
export function BookingDone() {
  const { orders, hydrated } = useBooking();
  if (!hydrated) return <main className="min-h-[60vh]" />;
  const order = orders.find((o) => o.status === "confirmed");

  if (!order) {
    return (
      <main data-m-center className="mx-auto w-full max-w-[720px] px-[clamp(16px,4vw,24px)] pt-[clamp(40px,7vw,72px)] pb-[120px]">
        <h1 className="font-display text-[clamp(29px,5.6vw,44px)] tracking-[-.02em] font-medium">No confirmed booking yet</h1>
        <p className="mt-3 text-base text-stone-600">
          Bookings paid by Mobile Money or bank transfer show here once {SITE.host.firstName} confirms them. <Link href="/trips">See your trips</Link>
        </p>
      </main>
    );
  }
  const a = getApartment(order.apartmentId);

  return (
    <main className="mx-auto w-full max-w-[720px] px-[clamp(16px,4vw,24px)] pt-[clamp(40px,7vw,72px)] pb-[120px]">
      <div data-m-center>
      <div className="grid size-[52px] place-items-center rounded-full bg-brand-tint text-brand">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m5 13 4 4L19 7" />
        </svg>
      </div>
      <h1 className="font-display mt-[22px] text-[clamp(29px,5.6vw,44px)] tracking-[-.02em] font-medium">
        You&apos;re booked, {order.name.split(" ")[0]}.
      </h1>
      <p className="mt-3 text-[16.5px] leading-[1.6] text-stone-600">
        Confirmation {order.ref} is on its way to {order.email || "your email"}. {SITE.host.firstName} will message you with check-in
        details a few days before arrival.
      </p>
      </div>
      <div className="mt-8 overflow-hidden rounded-lg border border-stone-200 bg-white">
        <div className="relative h-[180px]">
          <Image src={a.images[0]} alt={a.name} fill sizes="720px" className="object-cover" />
        </div>
        <div className="p-[22px]">
          <div className="text-[17px] font-semibold">{a.name}</div>
          <div className="mt-[3px] text-[13.5px] text-stone-500">{a.loc}</div>
          <div className="mt-[18px] grid grid-cols-3 gap-4">
            {[
              { l: "Dates", v: datesLabel(order.checkIn, order.checkOut) },
              { l: "Guests", v: guestsLabel(order.guests) },
              { l: "Paid", v: order.amountLabel },
            ].map((x) => (
              <div key={x.l}>
                <div className="text-[11px] font-semibold uppercase tracking-[.06em] text-stone-500">{x.l}</div>
                <div className="mt-[5px] text-sm">{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div data-m-row className="mt-6 flex flex-nowrap gap-2.5">
        <Link
          href="/stays"
          className="inline-flex h-11 items-center rounded-[11px] bg-brand px-5 text-[14.5px] font-medium text-stone-50 hover:bg-brand-hover hover:text-stone-50"
        >
          <span className="sm:hidden">More stays</span>
          <span className="hidden sm:inline">Browse more stays</span>
        </Link>
        <button
          type="button"
          onClick={() => downloadIcs(order)}
          className="h-11 rounded-[11px] border border-stone-200 bg-white px-5 text-[14.5px] font-medium hover:bg-stone-100"
        >
          Add to calendar
        </button>
      </div>
    </main>
  );
}
