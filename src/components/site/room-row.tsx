"use client";

import Image from "next/image";
import Link from "next/link";

import { useBooking } from "@/context/booking-context";
import type { Apartment } from "@/lib/data";

/**
 * Wide listing card: photo on one side, name, stars, a short description, key figures and "View details" on
 * the other. Stacks (photo first) below 760px. Used on the home page and the results page.
 */
export function RoomRow({ apartment: a, flip = false }: { apartment: Apartment; flip?: boolean }) {
  const { money } = useBooking();
  const figures: [string, string][] = [
    ["Area", a.specs.area],
    ["Bedrooms", a.specs.beds.replace(/\D+/g, "")],
    ["Guests", a.specs.guests.replace(/\D+/g, "")],
  ];
  return (
    <article data-reveal className="grid items-center gap-[clamp(20px,4vw,56px)] md:grid-cols-2">
      <Link
        href={`/apartments/${a.id}`}
        className={`group relative block aspect-[4/3] overflow-hidden bg-stone-200 ${flip ? "md:order-2" : ""}`}
      >
        <Image
          src={a.images[0]}
          alt={a.name}
          fill
          sizes="(min-width: 760px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute top-4 left-4 bg-brand px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.12em] text-stone-50">
          {money(a.price)} / night
        </span>
      </Link>
      <div data-m-center className="min-w-0">
        <h3 className="font-display text-[clamp(32px,3.6vw,46px)] font-medium leading-[1.05]">{a.name}</h3>
        <div className="mt-2 text-[15px] tracking-[.22em] text-brass" aria-label="Rated 5 out of 5">
          ★★★★★
        </div>
        <p className="mt-5 max-w-[46ch] text-[15.5px] leading-[1.75] text-stone-600">{a.blurb}</p>
        <dl className="mt-6 flex flex-wrap gap-x-9 gap-y-2 text-[14.5px] mportrait:justify-center">
          {figures.map(([k, v]) => (
            <div key={k} className="flex gap-1.5">
              <dt className="text-stone-500">{k}:</dt>
              <dd className="text-stone-900">{v}</dd>
            </div>
          ))}
        </dl>
        <Link
          href={`/apartments/${a.id}`}
          className="group mt-7 inline-flex items-center gap-2.5 text-[15px] font-medium text-stone-900 hover:text-brand"
        >
          View details
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
