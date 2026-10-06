import { existsSync } from "node:fs";
import path from "node:path";

import { Faq } from "@/components/home/faq";
import { HomeTop } from "@/components/home/home-top";
import { VideoShowcase } from "@/components/home/video-showcase";
import { Container, Phones } from "@/components/site/ui";
import { whatsappUrl } from "@/lib/booking";
import { CONFIG, PERKS, REVIEWS, TOUR_SLIDES, TOUR_VIDEO } from "@/lib/data";

export default function HomePage() {
  // The tour video is optional: the section shows "coming soon" until the file exists.
  const videoReady = existsSync(path.join(process.cwd(), "public", TOUR_VIDEO.src));

  return (
    <main>
      <HomeTop />

      <VideoShowcase {...TOUR_VIDEO} available={videoReady} slides={TOUR_SLIDES} />

      <section data-reveal id="experience">
        <Container className="pt-[clamp(48px,8vw,84px)]">
          <div data-m-center>
            <h2 className="font-display max-w-[22ch] text-[clamp(27px,5.2vw,40px)] tracking-[-.015em] font-medium">
              Every One-Bed Apartment includes
            </h2>
          </div>
          <div className="mt-[30px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
            {PERKS.map((k) => (
              <div key={k.mark} data-reveal className="rounded-[6px] border border-stone-200 bg-white p-[clamp(14px,3.4vw,22px)]">
                <div className="grid size-9 place-items-center rounded-[10px] bg-brand-tint text-[15px] font-semibold text-brand">
                  {k.mark}
                </div>
                <div className="mt-3.5 text-[15px] font-semibold">{k.title}</div>
                <div className="mt-1.5 text-[13.5px] leading-[1.55] text-stone-500">{k.body}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section data-reveal id="reviews">
        <Container className="pt-[clamp(48px,8vw,84px)]">
          <div className="overflow-hidden rounded-[8px] bg-brand p-[clamp(24px,4vw,48px)] text-stone-50">
            <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
              <div className="font-display text-[52px] leading-none">94%</div>
              <div className="text-sm text-stone-300">guest satisfaction · 400 clients · 1K+ nights</div>
            </div>
            <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-5">
              {REVIEWS.map((r) => (
                <div key={r.who} className="border-t border-stone-700 pt-[18px]">
                  <div className="text-[14.5px] leading-[1.6] text-stone-100">{r.quote}</div>
                  <div className="mt-3.5 text-[13px] text-stone-400">{r.who}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section data-reveal id="faq">
        <Container className="pt-[clamp(48px,8vw,84px)] pb-[clamp(40px,7vw,72px)]">
          <div className="flex flex-wrap items-start gap-[clamp(24px,4vw,48px)]">
            <div data-m-center className="min-w-0 flex-[1_1_260px] md:sticky md:top-[92px]">
              <h2 className="font-display text-[clamp(27px,5.2vw,40px)] tracking-[-.015em] font-medium">Good to know</h2>
              <p className="mt-3 text-[15px] leading-[1.6] text-stone-600">
                Still deciding? Call <Phones />, WhatsApp{" "}
                <a href={whatsappUrl([])} target="_blank" rel="noopener" className="whitespace-nowrap font-medium text-brand hover:text-brand-hover">
                  {CONFIG.whatsappDisplay}
                </a>
                , or email{" "}
                <a href={`mailto:${CONFIG.reservationsEmail}`} className="font-medium text-brand hover:text-brand-hover">
                  {CONFIG.reservationsEmail}
                </a>
                .
              </p>
            </div>
            <Faq />
          </div>
        </Container>
      </section>
    </main>
  );
}
