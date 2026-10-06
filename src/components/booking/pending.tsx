"use client";

import Link from "next/link";

import { useBooking } from "@/context/booking-context";
import { fmtDate, whatsappUrl } from "@/lib/booking";
import { Phones } from "@/components/site/ui";
import { CONFIG } from "@/lib/data";
import { SITE } from "@site";

export function PendingClaim() {
  const { lastOrder, orders, hydrated } = useBooking();
  const order = lastOrder ?? orders[0] ?? null;
  if (!hydrated) return <main className="min-h-[60vh]" />;

  if (!order) {
    return (
      <main data-m-center className="mx-auto w-full max-w-[720px] px-[clamp(16px,4vw,24px)] pt-[clamp(40px,7vw,72px)] pb-[120px]">
        <h1 className="font-display text-[clamp(26px,4.8vw,46px)] tracking-[-.02em] font-medium">No pending booking</h1>
        <p className="mt-2.5 text-base text-stone-600">
          Start from an apartment to make a booking. <Link href="/stays">Browse apartments</Link>
        </p>
      </main>
    );
  }

  const rows = [
    { label: "Apartment", value: order.apartment },
    { label: "Dates", value: `${fmtDate(order.checkIn, true) || "—"} → ${fmtDate(order.checkOut, true) || "—"}` },
    { label: "Guests", value: String(order.guests) },
    { label: "Paid from", value: order.phone || "—" },
    { label: "Amount claimed", value: order.amountLabel },
  ];
  const nudge = whatsappUrl([
    `Hello ${SITE.host.firstName} — I've paid for booking ${order.ref} (${order.apartment}).`,
    `Amount: ${order.amountLabel} by ${order.method}${order.phone ? ` from ${order.phone}` : ""}.`,
    `Name: ${order.name}`,
  ]);

  return (
    <main className="mx-auto w-full max-w-[720px] px-[clamp(16px,4vw,24px)] pt-[clamp(40px,7vw,72px)] pb-[120px]">
      <div data-m-center>
        <div className="grid size-[52px] place-items-center rounded-full bg-amber-100 text-[22px] text-amber-800" aria-hidden="true">
          ⏳
        </div>
        <h1 className="font-display mt-5 text-[clamp(26px,4.8vw,46px)] tracking-[-.02em] font-medium">We&apos;ll confirm shortly</h1>
        <p className="mt-2.5 text-base leading-[1.6] text-stone-600">
          Thanks {order.name.split(" ")[0]} — your booking is recorded as <strong>pending</strong>. Please call us on{" "}
          <Phones />, or email{" "}
          <a href={`mailto:${CONFIG.reservationsEmail}`} className="font-medium text-brand hover:text-brand-hover">
            {CONFIG.reservationsEmail}
          </a>
          , after payment. Your booking will be confirmed, and you&apos;ll get an
          Email/SMS notification on {order.phone || "your phone"}, once funds have cleared in our account. Thank you for
          your support!
        </p>
      </div>
      <div className="mt-[26px] overflow-hidden rounded-lg border border-stone-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-5 py-4">
          <span className="text-[13px] font-semibold">Reference {order.ref}</span>
          <span className="rounded-full bg-amber-100 px-[9px] py-[5px] text-[11px] font-semibold uppercase tracking-[.06em] text-amber-800">
            Pending verification
          </span>
        </div>
        <div className="grid gap-2.5 px-5 py-[18px]">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between gap-4 text-sm">
              <span className="text-stone-500">{r.label}</span>
              <span className="text-right font-medium">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div data-m-center>
        <p className="mt-4 text-[13px] leading-[1.6] text-stone-500">
          Submitting this form is a record of your payment claim, not a receipt — nothing is marked paid until the team
          verifies it.
        </p>
      </div>
      <div data-m-row className="mt-[22px] flex flex-nowrap gap-2.5">
        <a
          href={nudge}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center rounded-md border border-brand bg-white px-[18px] text-sm font-medium text-brand hover:bg-brand-tint"
        >
          <span className="sm:hidden">WhatsApp {SITE.host.firstName}</span>
          <span className="hidden sm:inline">Nudge {SITE.host.firstName} on WhatsApp</span>
        </a>
        <Link
          href="/trips"
          className="inline-flex h-11 items-center rounded-md border border-stone-200 bg-white px-[18px] text-sm text-stone-900 hover:bg-stone-100 hover:text-stone-900"
        >
          <span className="sm:hidden">Your trips</span>
          <span className="hidden sm:inline">View your trips</span>
        </Link>
      </div>
    </main>
  );
}
