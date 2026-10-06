import Image from "next/image";
import Link from "next/link";

import { Container, Eyebrow } from "@/components/site/ui";
import { SERVICES } from "@/lib/data";
import { SITE } from "@site";

const FACT_ICONS = {
  key: "M15 7a4 4 0 1 1-3.9 4.9L4 19v2h3v-2h2v-2h2l1.1-1.1A4 4 0 0 1 15 7zm1.5 2.5a1 1 0 1 0 0 .01",
  wifi: "M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01",
  pin: "M12 21s-7-6.6-7-12a7 7 0 0 1 14 0c0 5.4-7 12-7 12zm0-9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  chat: "M20 11.5a8.5 8.5 0 0 1-12.4 7.6L3 20.5l1.4-4.6A8.5 8.5 0 1 1 20 11.5z",
};

/** Four quick facts under the booking bar: what guests most want to know before scrolling on. */
export function QuickFacts() {
  const facts: { icon: keyof typeof FACT_ICONS; title: string; body: string }[] = [
    { icon: "key", title: "Self check-in", body: `${SITE.house.checkIn}, with your own code` },
    { icon: "wifi", title: "Fast Wi-Fi", body: "Fibre throughout, good for work" },
    { icon: "pin", title: SITE.location.area, body: SITE.location.travel },
    { icon: "chat", title: "Host on call", body: `${SITE.host.firstName} replies on WhatsApp` },
  ];
  return (
    <Container className="pt-[clamp(36px,5vw,56px)]">
      <ul className="grid grid-cols-2 gap-x-6 gap-y-8 border-b border-stone-200 pb-[clamp(32px,5vw,56px)] md:grid-cols-4">
        {facts.map((f) => (
          <li key={f.title} className="flex items-start gap-3.5 mportrait:flex-col mportrait:items-center mportrait:text-center">
            <span className="grid size-11 flex-none place-items-center rounded-full border border-brass/50 text-brass">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={FACT_ICONS[f.icon]} />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold">{f.title}</span>
              <span className="mt-0.5 block text-[13.5px] leading-[1.5] text-stone-500">{f.body}</span>
            </span>
          </li>
        ))}
      </ul>
    </Container>
  );
}

/** Three neighbourhood photos that lead on to the Services page. */
export function NeighbourhoodTeaser() {
  const spots = SERVICES.filter((s) => s.cat === "Neighbourhood").slice(0, 3);
  return (
    <section data-reveal className="bg-white">
      <Container className="py-[clamp(56px,9vw,112px)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div data-m-center className="min-w-0">
            <Eyebrow>The neighbourhood</Eyebrow>
            <h2 className="font-display mt-3 max-w-[16ch] text-[clamp(34px,5vw,56px)] font-medium leading-[1.05]">
              Step outside into {SITE.location.area}.
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 border-b border-stone-900 pb-1 text-[12px] font-semibold uppercase tracking-[.16em] text-stone-900 hover:border-brass hover:text-brass mportrait:mx-auto"
          >
            Services &amp; local guide
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </Link>
        </div>
        <div className="mt-[clamp(28px,4vw,48px)] grid gap-[clamp(12px,2vw,24px)] md:grid-cols-3">
          {spots.map((s) => (
            <Link key={s.title} href="/services" className="group relative block aspect-[4/5] overflow-hidden bg-stone-200 text-stone-50 hover:text-stone-50 md:aspect-[3/4]">
              <Image src={s.image} alt={s.title} fill sizes="(min-width: 760px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
              <span className="absolute inset-0 bg-gradient-to-t from-stone-900/75 via-stone-900/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-6 mportrait:text-center">
                <span className="block text-[11px] font-semibold uppercase tracking-[.2em] text-stone-50/75">{s.meta}</span>
                <span className="font-display mt-1 block text-[30px] font-medium leading-tight">{s.title}</span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** Full-width photo band that closes the page with one clear next step. */
export function ClosingCta() {
  return (
    <section className="relative isolate overflow-hidden bg-stone-900 text-stone-50">
      <Image src="https://images.pexels.com/photos/6143348/pexels-photo-6143348.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" fill sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-brand/70" />
      <Container className="py-[clamp(80px,12vw,160px)] text-center">
        <Eyebrow className="justify-center before:hidden">Your stay</Eyebrow>
        <h2 className="font-display mx-auto mt-4 max-w-[14ch] text-[clamp(40px,7vw,88px)] font-medium leading-[1]">Ready when you are.</h2>
        <p className="mx-auto mt-5 max-w-[44ch] text-[16px] leading-[1.7] text-stone-50/80">
          Pick your dates, choose your apartment and you&apos;re set. No account needed.
        </p>
        <Link
          href="/stays"
          data-m-btn
          className="mt-9 inline-flex h-14 items-center justify-center bg-stone-50 px-10 text-[13px] font-semibold uppercase tracking-[.16em] text-brand transition-colors hover:bg-brand-tint hover:text-brand"
        >
          Check availability
        </Link>
      </Container>
    </section>
  );
}
