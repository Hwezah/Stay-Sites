"use client";

import Image from "next/image";
import { useRef } from "react";

import { PhotoButton } from "@/components/site/lightbox";
import type { Photo } from "@/lib/data";

/** Edge-to-edge row of large photos that scrolls sideways, with round arrows. Tapping a photo opens the album. */
export function PhotoCarousel({ photos }: { photos: Photo[] }) {
  const track = useRef<HTMLDivElement>(null);
  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  const arrow =
    "absolute top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white text-stone-900 shadow-[0_8px_24px_-8px_rgba(0,0,0,.45)] transition-transform hover:scale-105";

  return (
    <section aria-label="Photos" className="relative">
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-[clamp(10px,2vw,24px)] overflow-x-auto px-[8vw] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((p, i) => (
          <PhotoButton
            key={p.src + i}
            album={photos}
            index={i}
            className="relative aspect-[3/2] w-[84vw] flex-none snap-center overflow-hidden bg-stone-100 md:w-[64vw]"
          >
            <Image src={p.src} alt={p.alt} fill sizes="(min-width: 760px) 64vw, 84vw" className="object-cover" />
          </PhotoButton>
        ))}
      </div>
      <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className={`${arrow} left-[calc(8vw+12px)]`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5" />
          <path d="m11 6-6 6 6 6" />
        </svg>
      </button>
      <button type="button" onClick={() => step(1)} aria-label="Next photo" className={`${arrow} right-[calc(8vw+12px)]`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </button>
    </section>
  );
}
