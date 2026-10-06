"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { PhotoButton } from "@/components/site/lightbox";
import { HOME_PHOTOS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SITE, SITE_PLACE } from "@site";

const SLIDES = [
  { src: "/images/hero-living.jpg", alt: `${SITE.name} living room` },
  { src: "/images/room1-bedroom.jpg", alt: "Bedroom" },
  { src: "/images/room1-living.jpg", alt: "One-Bed Apartment 1 living room" },
  { src: "/images/room2-kitchen.jpg", alt: "Kitchen and dining nook" },
  { src: "/images/hero-balcony.jpg", alt: "Balcony" },
];

const HOLD_MS = 5500;

/**
 * Full-bleed home hero: room photos crossfade with a slow zoom behind the
 * headline and calls to action. 80% of the screen height on phones (portrait),
 * full height on wider screens. The next photo is mounted ahead of time so each
 * change is a smooth fade, never a blank frame.
 */
export function Hero() {
  const [index, setIndex] = useState(0);
  const count = SLIDES.length;

  useEffect(() => {
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), HOLD_MS);
    return () => clearTimeout(t);
  }, [index, count]);

  return (
    <section
      aria-label={`Welcome to ${SITE.name}`}
      className="relative isolate flex h-[80svh] min-h-[520px] flex-col justify-end overflow-hidden bg-stone-900 text-stone-50 sm:h-svh"
    >
      {SLIDES.map((s, i) => {
        const active = i === index;
        const next = i === (index + 1) % count;
        const prev = i === (index - 1 + count) % count;
        if (!active && !next && !prev) return null;
        return (
          <div
            key={s.src}
            aria-hidden={!active}
            className={cn(
              "absolute inset-0 -z-10 transition-opacity duration-[1400ms] ease-in-out",
              active ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={s.src}
              alt={active ? s.alt : ""}
              fill
              priority={i === 0}
              sizes="100vw"
              className={cn(
                "object-cover will-change-transform motion-safe:transition-transform motion-safe:ease-linear",
                // The zoom keeps running through the fade-out so motion never stalls.
                active || prev ? "scale-110 motion-safe:duration-[7000ms]" : "scale-100 duration-0",
              )}
            />
          </div>
        );
      })}
      {/* Soft top shade so the transparent header's white logo and links stay readable. */}
      <div className="absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-stone-900/55 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-900/80 via-stone-900/35 to-stone-900/25 lg:bg-gradient-to-r lg:from-stone-900/70 lg:via-stone-900/35 lg:to-stone-900/10" />

      <div data-m-center className="mx-auto w-full max-w-[1400px] px-[clamp(16px,4vw,24px)] pb-[clamp(16px,2.5vw,28px)]">
        <div className="flex items-center gap-3 text-[11.5px] font-semibold uppercase tracking-[.2em] mportrait:justify-center mportrait:text-[10.5px] mportrait:tracking-[.14em] text-stone-50/85 sm:text-xs">
          <span aria-hidden="true" className="h-px w-8 bg-stone-50/70 mportrait:hidden" />
          {SITE.name} · {SITE_PLACE}
        </div>
        <h1 className="font-display mt-3 max-w-[16ch] text-[clamp(38px,7vw,96px)] font-medium leading-[1] tracking-[-.01em] text-pretty">
          {SITE.hero.headline}
        </h1>
      </div>


      <div data-m-center className="mx-auto w-full max-w-[1400px] px-[clamp(16px,4vw,24px)] pb-[112px] lg:pb-[168px]">
        <p className="max-w-[48ch] text-[15px] leading-[1.6] text-stone-50/90 sm:text-[17px]">
          {SITE.hero.intro}
        </p>
        {/* Hidden on phones in portrait, where the sticky "Book a room" bar takes over. */}
        <div className="mt-8 hidden flex-nowrap items-center gap-4 whitespace-nowrap sm:flex">
          <Link
            href="/#stays"
            className="inline-flex h-14 flex-none items-center gap-2.5 rounded-[4px] bg-white px-8 text-[12.5px] font-semibold uppercase tracking-[.14em] text-stone-900 shadow-[0_10px_30px_-12px_rgba(0,0,0,.5)] transition-colors hover:bg-brand-tint hover:text-stone-900"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M7 17 17 7" />
              <path d="M8 7h9v9" />
            </svg>
            Book a room
          </Link>
          <span aria-hidden="true" className="h-8 w-px bg-stone-50/60" />
          <Link
            href="/services"
            className="inline-flex h-14 flex-none items-center rounded-[4px] bg-brand px-8 text-[12.5px] font-semibold uppercase tracking-[.14em] text-stone-50 shadow-[0_10px_30px_-12px_rgba(0,0,0,.5)] transition-colors hover:bg-brand-hover hover:text-stone-50"
          >
            Explore Services
          </Link>
        </div>
      </div>

      {/* Slide dots above the "View photos" pill, bottom center. Lifted on large screens to clear the search bar. */}
      <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-3 lg:bottom-20">
        <div className="flex gap-1.5" aria-hidden="true">
          {SLIDES.map((s, i) => (
            <span
              key={s.src}
              className={cn("h-1 rounded-full bg-stone-50 transition-all duration-500", i === index ? "w-5" : "w-1.5 opacity-50")}
            />
          ))}
        </div>
        <PhotoButton
          album={HOME_PHOTOS}
          label="View photos"
          className="rounded-full bg-stone-900/40 px-4 py-2 text-[12.5px] font-medium text-stone-50 backdrop-blur-sm hover:bg-stone-900/60"
        >
          View photos
        </PhotoButton>
      </div>
    </section>
  );
}
