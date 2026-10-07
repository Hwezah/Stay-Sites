"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { PhotoButton } from "@/components/site/lightbox";
import type { Photo } from "@/lib/data";

const SPEED = 40; // px per second
const RESUME_MS = 2500; // pause after a touch or swipe before drifting again

/**
 * Edge-to-edge strip of photos with no gaps that drifts sideways on its own. It stops while the visitor
 * hovers, touches, swipes or tabs into it, and picks up again shortly after. The photos are repeated enough
 * times (more for short albums) that the loop is seamless. Tapping a photo opens the album.
 */
export function PhotoCarousel({ photos }: { photos: Photo[] }) {
  const track = useRef<HTMLDivElement>(null);
  const copies = 1 + Math.ceil(3 / Math.max(photos.length, 1));

  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let paused = false;
    let pos = el.scrollLeft;
    let last = 0;
    let frame = 0;
    let resume: ReturnType<typeof setTimeout> | undefined;

    const tick = (t: number) => {
      const dt = last ? Math.min(t - last, 64) : 0;
      last = t;
      if (!paused) {
        const half = el.scrollWidth / copies;
        pos += (SPEED * dt) / 1000;
        if (pos >= half) pos -= half;
        el.scrollLeft = pos;
      }
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      clearTimeout(resume);
      paused = true;
    };
    const go = (delay = 0) => {
      clearTimeout(resume);
      resume = setTimeout(() => {
        // Carry on from wherever the visitor left it, wrapped back into the first copy.
        const half = el.scrollWidth / copies;
        pos = half ? el.scrollLeft % half : el.scrollLeft;
        paused = false;
      }, delay);
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") stop();
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") go();
    };
    const onTouchEnd = () => go(RESUME_MS);
    const onFocusOut = (e: FocusEvent) => {
      if (!el.contains(e.relatedTarget as Node | null)) go();
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      stop();
      go(RESUME_MS);
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("touchstart", stop, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("focusin", stop);
    el.addEventListener("focusout", onFocusOut);
    el.addEventListener("wheel", onWheel, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resume);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("touchstart", stop);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("focusin", stop);
      el.removeEventListener("focusout", onFocusOut);
      el.removeEventListener("wheel", onWheel);
    };
  }, [copies]);

  const strip = (copy: number) => (
    <div key={copy} className="flex flex-none" aria-hidden={copy > 0 || undefined} inert={copy > 0}>
      {photos.map((p, i) => (
        <PhotoButton
          key={p.src + i}
          album={photos}
          index={i}
          className="relative aspect-[3/2] w-[84vw] flex-none overflow-hidden bg-stone-100 md:w-[48vw] xl:w-[36vw]"
        >
          <Image
            src={p.src}
            alt={copy > 0 ? "" : p.alt}
            fill
            sizes="(min-width: 1280px) 36vw, (min-width: 760px) 48vw, 84vw"
            className="object-cover"
          />
        </PhotoButton>
      ))}
    </div>
  );

  return (
    <section aria-label="Photos">
      <div ref={track} className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {Array.from({ length: copies }, (_, c) => strip(c))}
      </div>
    </section>
  );
}
