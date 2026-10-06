"use client";

import Image from "next/image";
import Link from "next/link";

import { SpecIcon } from "@/components/site/icon";
import { useBooking } from "@/context/booking-context";
import { cardSpecs, type Apartment } from "@/lib/data";

export function ApartmentCard({ apartment: a }: { apartment: Apartment }) {
  const { money } = useBooking();
  return (
    <Link
      href={`/apartments/${a.id}`}
      data-reveal
      className="group block overflow-hidden border border-stone-200 bg-white text-stone-900 transition-colors duration-200 hover:border-stone-400 hover:text-stone-900"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={a.images[0]} alt={a.name} fill sizes="(min-width: 1000px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        <div className="absolute top-3 left-3 whitespace-nowrap bg-brand px-2.5 py-[5px] text-[11px] font-semibold uppercase tracking-[.1em] text-stone-50">
          {a.tag}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-x-4 gap-y-1.5 bg-gradient-to-t from-stone-900/80 to-stone-900/0 px-3.5 pt-[30px] pb-3">
          {cardSpecs(a).map((s) => (
            <span key={s.label} className="flex items-center gap-1.5 whitespace-nowrap text-[12.5px] text-stone-50">
              <SpecIcon name={s.icon} />
              {s.label}
            </span>
          ))}
        </div>
      </div>
      <div className="px-[18px] pt-4 pb-[18px]">
        <div className="font-display text-[24px] font-medium leading-tight">{a.name}</div>
        <div className="mt-1 text-[13.5px] text-stone-500">
          {a.loc} · {a.sleeps}
        </div>
        <div className="mt-3.5 flex items-baseline gap-1.5">
          <span className="text-base font-semibold">{money(a.price)}</span>
          <span className="text-[13.5px] text-stone-500">night</span>
        </div>
      </div>
    </Link>
  );
}
