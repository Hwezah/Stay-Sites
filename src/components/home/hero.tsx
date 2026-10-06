"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { PhotoButton } from "@/components/site/lightbox";
import { HOME_PHOTOS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SITE } from "@site";

const SLIDES = [
  { src: "https://images.pexels.com/photos/6580396/pexels-photo-6580396.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: `${SITE.name} living room` },
  { src: "/images/room1-bedroom.jpg", alt: "Bedroom" },
  { src: "https://images.pexels.com/photos/6580416/pexels-photo-6580416.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Linen Space living room" },
  { src: "https://images.pexels.com/photos/6782569/pexels-photo-6782569.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Kitchen and dining nook" },
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
      className="relative isolate flex h-[80svh] min-h-[520px] flex-col overflow-hidden bg-stone-900 text-stone-50 sm:h-svh"
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
      <div className="absolute inset-0 -z-10 bg-stone-900/40" />


      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center px-[clamp(16px,4vw,24px)] pt-24 text-center lg:pb-16">
        <h1 className="font-display max-w-[13ch] text-[clamp(46px,8.4vw,128px)] font-medium leading-[.98] tracking-[-.01em] text-balance">
          {SITE.hero.headline}
        </h1>
        <PhotoButton
          album={HOME_PHOTOS}
          label="View photos"
          className="mt-[clamp(18px,3vw,30px)] border-b border-stone-50/60 pb-1 text-[11.5px] font-semibold uppercase tracking-[.2em] text-stone-50 hover:border-stone-50"
        >
          View photos
        </PhotoButton>
      </div>
    </section>
  );
}
