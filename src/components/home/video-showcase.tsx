"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { Photo } from "@/lib/data";
import { cn } from "@/lib/utils";

const SLIDE_MS = 4000;

/**
 * Full-width "tour" block: darkened poster with a gold play button. Plays the
 * video in place once it exists in /public/videos; until then the button runs
 * a slideshow of the room photos in the same frame.
 */
export function VideoShowcase({
  src,
  poster,
  title,
  available,
  slides,
}: {
  src: string;
  poster: string;
  title: string;
  available: boolean;
  slides: Photo[];
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <section data-reveal aria-label={title} className="mt-[clamp(48px,8vw,84px)]">
      <div className="relative h-[clamp(320px,56vw,760px)] w-full overflow-hidden bg-stone-900">
        {playing && available && (
          <video src={src} poster={poster} controls autoPlay playsInline className="absolute inset-0 size-full bg-black object-contain" />
        )}
        {playing && !available && <Slideshow slides={slides} onClose={() => setPlaying(false)} />}
        {!playing && (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 size-full cursor-pointer"
            aria-label={available ? `Play video: ${title}` : `Play photo tour: ${title}`}
          >
            <Image src={poster} alt="" fill sizes="100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
            <span className="absolute inset-0 bg-stone-900/40 transition-colors group-hover:bg-stone-900/30" />
            <span className="absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
              <span className="absolute size-[clamp(72px,9vw,124px)] animate-ping rounded-full bg-brand/40 [animation-duration:2.4s]" />
              <span className="relative grid size-[clamp(72px,9vw,124px)] place-items-center rounded-full bg-brand text-stone-50 shadow-[0_18px_40px_-12px_rgba(28,25,23,.55)] transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 24 24" className="size-[38%]" fill="currentColor" aria-hidden="true">
                  <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" />
                </svg>
              </span>
            </span>
            <span className="absolute inset-x-0 bottom-[clamp(18px,4vw,40px)] px-4 text-center">
              <span className="block text-xs font-semibold uppercase tracking-[.12em] text-brand-soft">Take a tour</span>
              <span className="font-display mt-2 block text-[clamp(22px,3.6vw,38px)] text-stone-50">{title}</span>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}

/** Crossfading photo tour with a slow zoom on each slide. */
function Slideshow({ slides, onClose }: { slides: Photo[]; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (paused || count < 2) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, paused, count]);

  const ctrl =
    "grid size-11 place-items-center rounded-full bg-stone-900/45 text-stone-50 backdrop-blur-sm transition-colors hover:bg-stone-900/65";

  return (
    <div className="absolute inset-0" aria-roledescription="slideshow" aria-live={paused ? "polite" : "off"}>
      {slides.map((s, i) => {
        const active = i === index;
        // Only mount the current, previous and next slides to keep it light.
        const near = active || i === (index + 1) % count || i === (index - 1 + count) % count;
        if (!near) return null;
        return (
          <div
            key={s.src + i}
            className={cn("absolute inset-0 transition-opacity duration-1000", active ? "opacity-100" : "opacity-0")}
            aria-hidden={!active}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="100vw"
              className={cn(
                "object-cover transition-transform ease-linear",
                active && !paused ? "scale-[1.08] duration-[5000ms]" : "scale-100 duration-0",
              )}
            />
          </div>
        );
      })}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-stone-900/30" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-end gap-2 p-[clamp(12px,2.5vw,24px)]">
        <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play slideshow" : "Pause slideshow"} className={ctrl}>
          {paused ? (
            <svg viewBox="0 0 24 24" className="ml-0.5 size-5" fill="currentColor" aria-hidden="true">
              <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
              <rect x="6" y="4.5" width="4" height="15" rx="1" />
              <rect x="14" y="4.5" width="4" height="15" rx="1" />
            </svg>
          )}
        </button>
        <button type="button" onClick={onClose} aria-label="Close photo tour" className={ctrl}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M5 5 17 17" />
            <path d="M17 5 5 17" />
          </svg>
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 px-[clamp(16px,4vw,40px)] pb-[clamp(16px,3.5vw,36px)] text-stone-50">
        <div className="text-xs font-semibold uppercase tracking-[.12em] text-brand-soft">
          {index + 1} / {count}
        </div>
        <div className="font-display mt-1.5 text-[clamp(20px,3vw,32px)]">{slides[index].alt}</div>
        <div className="mt-4 flex gap-1.5" role="tablist" aria-label="Choose photo">
          {slides.map((s, i) => (
            <button
              key={s.src + i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Photo ${i + 1}: ${s.alt}`}
              onClick={() => setIndex(i)}
              className="relative h-1 flex-1 overflow-hidden rounded-full bg-stone-50/30"
            >
              <span
                key={i === index ? `on-${index}-${paused}` : "off"}
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full bg-stone-50",
                  i < index && "w-full",
                  i === index && (paused ? "w-full" : "w-0 animate-[progress_4s_linear_forwards]"),
                  i > index && "w-0",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
