"use client";

import { useState } from "react";

import { FAQS } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="min-w-0 flex-[1.4_1_340px] overflow-hidden rounded-[6px] border border-stone-200 bg-white">
      {FAQS.map((f, i) => {
        const on = open === i;
        return (
          <div
            key={f.q}
            className={cn(i < FAQS.length - 1 && "border-b border-stone-100", on ? "bg-stone-50" : "bg-white")}
          >
            <button
              type="button"
              aria-expanded={on}
              onClick={() => setOpen(on ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-[18px] text-left text-[14.5px] font-medium"
            >
              {f.q}
              <span
                className={cn(
                  "w-7 flex-none text-center text-[28px] font-light leading-none text-stone-500 transition-transform duration-200",
                  on && "rotate-45",
                )}
              >
                +
              </span>
            </button>
            {on && <div className="max-w-[62ch] px-5 pb-5 text-sm leading-[1.6] text-stone-600">{f.a}</div>}
          </div>
        );
      })}
    </div>
  );
}
