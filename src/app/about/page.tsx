import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PhotoButton } from "@/components/site/lightbox";
import { Container, Eyebrow } from "@/components/site/ui";
import { CONFIG, STATS, TIMELINE } from "@/lib/data";
import { SITE, SITE_PLACE } from "@site";

export const metadata: Metadata = {
  title: "About",
  description: `The story behind ${SITE.name}, in ${SITE_PLACE}.`,
};

export default function AboutPage() {
  return (
    <main>
      <Container className="pt-[clamp(28px,5vw,48px)] pb-24">
        <div className="flex flex-wrap items-center gap-[clamp(28px,4vw,56px)]">
          <div data-reveal data-m-center className="min-w-0 flex-[1.15_1_320px]">
            <Eyebrow>Our story, from the host</Eyebrow>
            <h1 className="font-display mt-3 text-[clamp(28px,5.4vw,58px)] tracking-[-.02em] font-medium">About {SITE.name}</h1>
            <p className="mt-[18px] max-w-[56ch] text-[16.5px] leading-[1.7] text-stone-700">
              “{SITE.host.quote}” — {SITE.host.name}, {SITE.host.role}
            </p>
            <p className="mt-3.5 max-w-[56ch] text-[16.5px] leading-[1.7] text-stone-700">
              {SITE.name} offers thoughtfully furnished apartments in {SITE_PLACE} — {SITE.tagline.charAt(0).toLowerCase() + SITE.tagline.slice(1)}
            </p>
            <p className="mt-5 text-[15px] text-stone-600">
              Write to {SITE.host.firstName} directly:{" "}
              <a href={`mailto:${CONFIG.founderEmail}`} className="font-medium text-brand hover:text-brand-hover">
                {CONFIG.founderEmail}
              </a>
            </p>
          </div>
          <PhotoButton
            album={[{ src: "/images/hero-balcony.jpg", alt: `${SITE.name}` }]}
            className="relative h-[clamp(240px,34vw,440px)] w-full min-w-0 flex-[1_1_300px] overflow-hidden rounded-[8px] bg-stone-100"
          >
            <Image src="/images/hero-balcony.jpg" alt={SITE.name} fill priority sizes="(min-width: 640px) 45vw, 100vw" className="object-cover" />
          </PhotoButton>
        </div>

        <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-4">
          {STATS.map((s) => (
            <div key={s.label} data-reveal className="rounded-[6px] border border-stone-200 bg-white p-[clamp(13px,3.2vw,24px)]">
              <div className="font-display text-[clamp(32px,4vw,40px)] leading-none tracking-[-.01em] font-medium">{s.n}</div>
              <div className="mt-2.5 text-[13.5px] leading-[1.5] text-stone-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-[clamp(36px,6vw,56px)] flex flex-wrap items-start gap-[clamp(24px,4vw,48px)]">
          <h2 className="font-display min-w-0 flex-[1_1_260px] text-center md:sticky md:top-[92px] text-[clamp(26px,4.6vw,36px)] tracking-[-.015em] sm:text-left font-medium">
            Our vision
          </h2>
          <div className="grid min-w-0 flex-[1.4_1_340px]">
            {TIMELINE.map((t) => (
              <div key={t.title} data-reveal className="grid grid-cols-[90px_1fr] gap-[22px] border-t border-stone-200 py-[22px]">
                <div className="text-sm font-semibold text-brand">{t.year}</div>
                <div>
                  <div className="text-[15.5px] font-semibold">{t.title}</div>
                  <div className="mt-[5px] max-w-[62ch] text-[14.5px] leading-[1.6] text-stone-500">{t.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-[clamp(20px,4vw,32px)] rounded-[8px] bg-brand p-[clamp(22px,5vw,48px)] text-stone-50">
          <div className="min-w-0 flex-[1_1_280px]">
            <h2 className="font-display text-[clamp(26px,5.4vw,34px)] font-medium">Planning a longer stay?</h2>
            <p className="mt-2.5 max-w-[52ch] text-[15px] leading-[1.6] text-stone-300">
              Talk to us about extended stays, group bookings, or adding laundry, cleaning and car wash to your visit.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex min-h-12 flex-[1_1_240px] items-center justify-center rounded-md bg-stone-50 px-6 text-[14.5px] font-semibold text-stone-900 hover:bg-stone-200 hover:text-stone-900"
          >
            Talk to {SITE.host.firstName}
          </Link>
        </div>
      </Container>
    </main>
  );
}
