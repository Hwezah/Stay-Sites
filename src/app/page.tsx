import { existsSync } from "node:fs";
import path from "node:path";

import { ClosingCta, NeighbourhoodTeaser } from "@/components/home/extras";
import { Faq } from "@/components/home/faq";
import { HomeTop } from "@/components/home/home-top";
import { VideoShowcase } from "@/components/home/video-showcase";
import { Container, Eyebrow, Phones } from "@/components/site/ui";
import { whatsappUrl } from "@/lib/booking";
import { CONFIG, PERKS, REVIEWS, TOUR_SLIDES, TOUR_VIDEO } from "@/lib/data";

export default function HomePage() {
  // The tour video is optional: the section shows "coming soon" until the file exists.
  const videoReady = existsSync(path.join(process.cwd(), "public", TOUR_VIDEO.src));

  return (
    <main>
      <HomeTop />

      <VideoShowcase {...TOUR_VIDEO} available={videoReady} slides={TOUR_SLIDES} />

      <section data-reveal id="experience" className="bg-brand text-stone-50">
        <Container className="py-[clamp(56px,9vw,112px)]">
          <div data-m-center>
            <Eyebrow>Included in every stay</Eyebrow>
            <h2 className="font-display mt-3 max-w-[18ch] text-[clamp(34px,5.6vw,64px)] font-medium leading-[1.05]">
              Everything you need, nothing you don&apos;t.
            </h2>
          </div>
          <div className="mt-[clamp(36px,5vw,64px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-8 gap-y-10">
            {PERKS.map((k) => (
              <div key={k.mark} data-reveal className="border-t border-stone-50/20 pt-6 mportrait:text-center">
                <div className="font-display text-[56px] leading-none text-brass">{k.mark}</div>
                <div className="mt-4 text-[17px] font-medium">{k.title}</div>
                <div className="mt-2 text-[14px] leading-[1.65] text-stone-50/70">{k.body}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section data-reveal id="reviews">
        <Container className="py-[clamp(64px,10vw,128px)] text-center">
          <div className="text-[18px] tracking-[.3em] text-brass" aria-label="Rated 5 out of 5">★★★★★</div>
          {REVIEWS.map((r) => (
            <figure key={r.who} className="mx-auto mt-6 max-w-[880px]">
              <blockquote className="font-display text-[clamp(28px,4.2vw,52px)] font-medium leading-[1.15]">“{r.quote}”</blockquote>
              <figcaption className="mt-6 text-[12px] font-semibold uppercase tracking-[.2em] text-stone-500">{r.who}</figcaption>
            </figure>
          ))}
          <div className="mx-auto mt-10 h-px w-16 bg-brass" />
        </Container>
      </section>

      <NeighbourhoodTeaser />

      <section data-reveal id="faq">
        <Container className="pt-[clamp(56px,9vw,112px)] pb-[clamp(56px,9vw,112px)]">
          <div className="flex flex-wrap items-start gap-[clamp(24px,4vw,48px)]">
            <div data-m-center className="min-w-0 flex-[1_1_260px] md:sticky md:top-[92px]">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="font-display mt-3 text-[clamp(34px,5vw,56px)] font-medium leading-[1.05]">Good to know</h2>
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

      <ClosingCta />
    </main>
  );
}
