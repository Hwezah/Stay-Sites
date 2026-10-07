"use client";

import { useBooking } from "@/context/booking-context";

export function PriceRows() {
  const { totals: t, money, cartItems } = useBooking();
  const rows = [
    ...(t.n ? [{ label: `${money(t.price)} × ${t.n} ${t.n === 1 ? "night" : "nights"}`, value: money(t.stay) }] : []),
    // Fee lines only appear when a fee is set.
    ...(t.clean ? [{ label: "Cleaning fee", value: money(t.clean) }] : []),
    ...(t.service ? [{ label: "Service fee", value: money(t.service) }] : []),
    ...(t.tax ? [{ label: "Occupancy tax", value: money(t.tax) }] : []),
    ...cartItems.map((c) => ({ label: c.title, value: money(c.amount ?? 0) })),
  ];
  return (
    <div className="grid gap-2.5">
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between gap-3 text-sm text-stone-600">
          <span>{r.label}</span>
          <span className="text-right">{r.value}</span>
        </div>
      ))}
    </div>
  );
}
