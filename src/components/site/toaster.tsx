"use client";

import { usePathname } from "next/navigation";

import { useUI } from "@/context/ui-context";
import { cn } from "@/lib/utils";
import { showsBookBar } from "@/components/site/book-bar";

export function Toaster() {
  const { toasts, dismissToast } = useUI();
  const barRoute = showsBookBar(usePathname());

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-60 grid justify-items-center gap-2.5 px-5",
        barRoute ? "bottom-[92px] sm:bottom-5" : "bottom-5",
      )}
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto flex w-[min(336px,100%)] animate-toast-in items-start gap-[11px] rounded-[6px] border border-stone-200 bg-white p-3.5 shadow-toast"
        >
          <div
            className={cn(
              "grid size-[22px] flex-none place-items-center rounded-full text-xs font-bold",
              t.tone === "warn" && "bg-amber-100 text-amber-800",
              t.tone === "hint" && "bg-stone-100 text-stone-600",
              t.tone === "ok" && "bg-brand-tint text-brand",
            )}
          >
            {t.tone === "warn" ? "!" : t.tone === "hint" ? "i" : "✓"}
          </div>
          <div className="min-w-0">
            <div className="text-[13.5px] font-semibold">{t.title}</div>
            <div className="mt-0.5 text-[13px] leading-[1.45] text-stone-600">{t.body}</div>
          </div>
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss"
            className="-mt-0.5 -mr-0.5 ml-auto grid size-[30px] flex-none place-items-center text-stone-400 hover:text-stone-900"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.1">
              <path d="M4 4 18 18" />
              <path d="M18 4 4 18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
