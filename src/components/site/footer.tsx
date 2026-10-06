import Link from "next/link";

import { NAV_ITEMS } from "@/lib/data";
import { SITE } from "@site";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-brand text-stone-50">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-center gap-[18px] px-[clamp(16px,4vw,24px)] py-[clamp(28px,5vw,44px)] text-center">
        <div className="font-display text-[28px] font-medium">{SITE.wordmark}</div>
        <div aria-hidden="true" className="h-px w-10 bg-accent" />
        <div className="flex flex-wrap items-center justify-center gap-5 text-[12px] uppercase tracking-[.14em] text-stone-50/70">
          {NAV_ITEMS.map((n) => (
            <Link key={n.href} href={n.href} className="text-stone-50/70 hover:text-stone-50">
              {n.label}
            </Link>
          ))}
          <Link href="/policies#privacy" className="text-stone-50/70 hover:text-stone-50">
            Privacy
          </Link>
          <span>© {new Date().getFullYear()} {SITE.name}</span>
        </div>
      </div>
    </footer>
  );
}
