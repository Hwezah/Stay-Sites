"use client";

import { ReviewModeration } from "@/components/admin/review-moderation";
import { StatusBadge } from "@/components/site/ui";
import { useBooking } from "@/context/booking-context";
import { fmtDate, guestsLabel } from "@/lib/booking";

export function AdminConsole() {
  const { orders, hydrated, settleOrder } = useBooking();
  const pending = orders.filter((o) => o.status === "pending").length;

  return (
    <main className="mx-auto w-full max-w-[1040px] px-[clamp(16px,4vw,24px)] pt-[clamp(28px,5vw,48px)] pb-[120px]">
      <div data-m-center className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(26px,4.8vw,46px)] tracking-[-.02em] font-medium">Admin console</h1>
          <p className="mt-2 text-[14.5px] text-stone-600">
            Verify the payment in the Mobile Money or bank account first, then confirm here. Only this screen can mark
            an order paid.
          </p>
        </div>
        <div className="whitespace-nowrap text-[12.5px] text-stone-500">{pending} pending</div>
      </div>

      <div className="mt-[26px] grid gap-3">
        {hydrated && orders.length === 0 && (
          <div className="rounded-lg border border-stone-200 bg-white px-[clamp(16px,4vw,24px)] py-[clamp(26px,5vw,36px)] text-center text-[14.5px] text-stone-500">
            No orders yet. Orders are stored in this browser until the database is connected, so only bookings made on
            this device appear here.
          </div>
        )}
        {orders.map((o) => (
          <div
            key={o.ref}
            className="grid gap-3.5 rounded-lg border border-stone-200 bg-white px-[clamp(13px,3.2vw,20px)] py-[clamp(13px,3.2vw,18px)]"
          >
            <div className="flex flex-wrap items-start gap-3.5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[15px] font-semibold">{o.ref}</span>
                  <StatusBadge status={o.status} />
                </div>
                <div className="mt-[7px] text-sm text-stone-700">
                  {o.apartment} · {fmtDate(o.checkIn, true) || "—"} → {fmtDate(o.checkOut, true) || "—"} ·{" "}
                  {guestsLabel(o.guests)}
                </div>
                <div className="mt-1 text-[13.5px] text-stone-500">
                  {o.name} · {o.phone || "—"} · {o.method} ·{" "}
                  {new Date(o.at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              <div className="whitespace-nowrap text-lg font-semibold">{o.amountLabel}</div>
            </div>
            {o.status === "pending" ? (
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => settleOrder(o.ref, "confirmed")}
                  className="h-10 rounded-[10px] bg-brand px-[18px] text-[13.5px] font-medium text-stone-50 hover:bg-brand-hover"
                >
                  Confirm payment
                </button>
                <button
                  type="button"
                  onClick={() => settleOrder(o.ref, "declined")}
                  className="h-10 rounded-[10px] border border-stone-200 bg-white px-[18px] text-[13.5px] font-medium text-red-700 hover:border-red-300 hover:bg-red-50"
                >
                  Decline
                </button>
              </div>
            ) : (
              <div className="text-[13px] text-stone-500">
                {o.status === "confirmed"
                  ? `Confirmed — notify ${o.phone || "the guest"} by SMS.`
                  : o.status === "declined"
                    ? "Declined — no apartment held."
                    : "Cancelled by the guest."}
              </div>
            )}
          </div>
        ))}
      </div>

      <ReviewModeration />
    </main>
  );
}
