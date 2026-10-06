"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import type { Photo } from "@/lib/data";
import { cn } from "@/lib/utils";

type Album = { photos: Photo[]; index: number };
type LightboxValue = { openAlbum: (photos: Photo[], index?: number) => void };

const LightboxContext = createContext<LightboxValue | null>(null);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [album, setAlbum] = useState<Album | null>(null);
  const openAlbum = useCallback((photos: Photo[], index = 0) => {
    if (photos.length) setAlbum({ photos, index });
  }, []);

  return (
    <LightboxContext.Provider value={{ openAlbum }}>
      {children}
      {album && <Viewer album={album} onChange={setAlbum} onClose={() => setAlbum(null)} />}
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within a LightboxProvider");
  return ctx;
}

/** Makes a photo (or any preview) open the album at `index` when clicked. */
export function PhotoButton({
  album,
  index = 0,
  className,
  label,
  children,
}: {
  album: Photo[];
  index?: number;
  className?: string;
  label?: string;
  children: ReactNode;
}) {
  const { openAlbum } = useLightbox();
  return (
    <button
      type="button"
      onClick={() => openAlbum(album, index)}
      aria-label={label ?? `View photo: ${album[index]?.alt ?? ""}`}
      className={cn("group block cursor-zoom-in text-left", className)}
    >
      {children}
    </button>
  );
}

function Viewer({
  album,
  onChange,
  onClose,
}: {
  album: Album;
  onChange: (a: Album) => void;
  onClose: () => void;
}) {
  const { photos, index } = album;
  const count = photos.length;
  const photo = photos[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) => onChange({ photos, index: (index + delta + count) % count }),
    [photos, index, count, onChange],
  );

  // Keyboard: Esc closes, arrows step through. Lock page scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [go, onClose]);

  useEffect(() => closeRef.current?.focus(), []);

  // Keep the active thumbnail in view.
  useEffect(() => {
    thumbsRef.current
      ?.querySelector<HTMLElement>(`[data-thumb="${index}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

  const arrow =
    "absolute top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-stone-900 shadow-[0_8px_24px_-6px_rgba(0,0,0,.6)] ring-1 ring-black/5 transition-transform hover:scale-105 active:scale-95";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      data-keep-open
      className="fixed inset-0 z-100 flex animate-sheet-in flex-col bg-stone-950 text-stone-50"
    >
      <div className="flex items-center justify-between gap-4 px-[clamp(14px,3vw,24px)] py-3">
        <div className="min-w-0">
          <div className="text-[13px] text-stone-400">
            {index + 1} / {count}
          </div>
          <div className="truncate text-[15px]">{photo.alt}</div>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close photo viewer"
          className="grid size-11 flex-none place-items-center rounded-full hover:bg-stone-50/10"
        >
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M6 6 22 22" />
            <path d="M22 6 6 22" />
          </svg>
        </button>
      </div>

      <div
        className="relative min-h-0 flex-1"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {/* Current photo plus its neighbours, preloaded and stacked, so changes are an instant fade. */}
        <div className="pointer-events-none absolute inset-x-[clamp(8px,6vw,80px)] inset-y-2">
          {photos.map((p, i) => {
            const near = i === index || i === (index + 1) % count || i === (index - 1 + count) % count;
            if (!near) return null;
            return (
              <Image
                key={p.src + i}
                src={p.src}
                alt={i === index ? p.alt : ""}
                fill
                sizes="100vw"
                priority={i === index}
                className={cn("object-contain transition-opacity duration-300", i === index ? "opacity-100" : "opacity-0")}
              />
            );
          })}
        </div>
        {count > 1 && (
          <>
            {/* Tap the left or right side of the photo to step back or forward. */}
            <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => go(-1)} className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize" />
            <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => go(1)} className="absolute inset-y-0 right-0 w-1/3 cursor-e-resize" />
          </>
        )}
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={cn(arrow, "left-3 sm:left-5")}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className={cn(arrow, "right-3 sm:right-5")}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div
          ref={thumbsRef}
          className="flex justify-start gap-2 overflow-x-auto px-[clamp(14px,3vw,24px)] pt-2 pb-[calc(12px+env(safe-area-inset-bottom))] sm:justify-center"
        >
          {photos.map((p, i) => (
            <button
              key={p.src + i}
              type="button"
              data-thumb={i}
              onClick={() => onChange({ photos, index: i })}
              aria-label={`Show photo ${i + 1}: ${p.alt}`}
              aria-current={i === index}
              className={cn(
                "relative h-14 w-20 flex-none overflow-hidden rounded-lg ring-2 transition-opacity",
                i === index ? "opacity-100 ring-brand" : "opacity-50 ring-transparent hover:opacity-80",
              )}
            >
              <Image src={p.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}
