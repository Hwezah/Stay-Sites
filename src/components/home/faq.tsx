"use client";

import { useState } from "react";

import { FAQS } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="min-w-0 flex-[1.4_1_340px] border-t border-stone-300">
      {FAQS.map((f, i) => {
        const on = open === i;
        return (
          <div
            key={f.q}
            className="border-b border-stone-300"
          >
            <button
              type="button"
              aria-expanded={on}
              onClick={() => setOpen(on ? -1 : i)}
              className="font-display flex w-full items-center justify-between gap-4 py-[22px] text-left text-[clamp(20px,2.2vw,26px)] font-medium"
            >
              {f.q}
              <span
                className={cn(
                  "w-7 flex-none text-center font-sans text-[28px] font-light leading-none text-brass transition-transform duration-300",
                  on && "rotate-45",
                )}
              >
                +
              </span>
            </button>
            {on && <div className="max-w-[62ch] pb-6 text-[15px] leading-[1.7] text-stone-600">{f.a}</div>}
          </div>
        );
      })}
    </div>
  );
}
