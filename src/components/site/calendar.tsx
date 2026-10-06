"use client";

import { useState } from "react";

import { useBooking } from "@/context/booking-context";
import { MONTHS, calendarDays, isoDate } from "@/lib/booking";
import { cn } from "@/lib/utils";

const DAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"];

/** Date-range picker. Past and blocked days are disabled. */
export function Calendar({ onDone, compact = false }: { onDone: () => void; compact?: boolean }) {
  const { checkIn, checkOut, pickDay, clearDates } = useBooking();
  const [today] = useState(() => isoDate(new Date()));
  const [view, setView] = useState(() => {
    const start = checkIn ? new Date(checkIn + "T00:00:00") : new Date();
    return { y: start.getFullYear(), m: start.getMonth() };
  });
  const days = calendarDays(view, today, checkIn, checkOut);
  const nav = "grid place-items-center rounded-lg border border-stone-200 bg-white hover:bg-stone-100";

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          className={cn(nav, compact ? "size-7" : "size-[30px]")}
          onClick={() => setView((v) => ({ y: v.m === 0 ? v.y - 1 : v.y, m: (v.m + 11) % 12 }))}
        >
          ‹
        </button>
        <div className={cn("font-semibold", compact ? "text-[13.5px]" : "text-sm")}>
          {MONTHS[view.m]} {view.y}
        </div>
        <button
          type="button"
          aria-label="Next month"
          className={cn(nav, compact ? "size-7" : "size-[30px]")}
          onClick={() => setView((v) => ({ y: v.m === 11 ? v.y + 1 : v.y, m: (v.m + 1) % 12 }))}
        >
          ›
        </button>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-0.5">
        {DAY_NAMES.map((d, i) => (
          <div key={i} className="py-1 text-center text-[11px] font-semibold text-stone-400">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((d) =>
          d.kind === "blank" ? (
            <div key={d.key} className="h-[38px]" />
          ) : (
            <button
              key={d.key}
              type="button"
              disabled={d.disabled}
              aria-pressed={d.selected}
              aria-label={d.iso + (d.blocked ? " (unavailable)" : "")}
              onClick={() => pickDay(d.iso)}
              className={cn(
                "h-[38px] text-[13.5px] disabled:cursor-not-allowed",
                d.selected
                  ? "rounded-[10px] bg-brand font-semibold text-stone-50"
                  : d.inRange
                    ? "rounded-[9px] bg-brand-tint"
                    : "rounded-[9px] hover:bg-stone-100 disabled:hover:bg-transparent",
                d.disabled && !d.selected && "text-stone-300",
                d.blocked && "line-through",
              )}
            >
              {d.label}
            </button>
          ),
        )}
      </div>
      <div
        className={cn(
          "flex items-center justify-between",
          compact ? "mt-2.5" : "mt-3 border-t border-stone-100 pt-3",
        )}
      >
        <button type="button" onClick={clearDates} className="text-[13px] text-stone-500 underline">
          Clear
        </button>
        <button
          type="button"
          onClick={onDone}
          className={cn(
            "rounded-[9px] bg-stone-900 font-medium text-stone-50",
            compact ? "h-[30px] px-3.5 text-[12.5px]" : "h-[34px] px-4 text-[13px]",
          )}
        >
          Done
        </button>
      </div>
    </div>
  );
}
