"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { ChevronLeft } from "@/components/site/icon";
import { useBooking } from "@/context/booking-context";
import { CONFIG } from "@/lib/data";
import { SITE, SITE_PLACE } from "@site";
import Image from "next/image";
import type { Currency } from "@/lib/booking";
import { cn } from "@/lib/utils";

/** Phone (tap to call) and location, each with an icon. Used in the header and over the hero. */
export function ContactLines({ className }: { className?: string }) {
  const phone = SITE.contact.phones[0];
  return (
    <div className={cn("grid gap-1.5 text-[13px] leading-tight", className)}>
      <a href={telHref(phone)} className="flex items-center gap-2.5 text-current hover:text-current hover:opacity-80">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
        </svg>
        {phone}
      </a>
      <span className="flex items-center gap-2.5">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
        </svg>
        {SITE_PLACE}
      </span>
    </div>
  );
}

/** The host's photo, or their initials on the brand colour when no photo is set (content/site.ts). */
export function HostAvatar({ size = 40 }: { size?: number }) {
  const style = { width: size, height: size };
  if (SITE.host.photo)
    return (
      <Image src={SITE.host.photo} alt={SITE.host.name} width={size} height={size} style={style} className="flex-none rounded-full object-cover object-top" />
    );
  const initials = SITE.host.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
  return (
    <span
      aria-hidden="true"
      style={{ ...style, fontSize: size * 0.38 }}
      className="grid flex-none place-items-center rounded-full bg-brand font-medium uppercase text-stone-50"
    >
      {initials}
    </span>
  );
}

/** "+256 776 401 100" → "tel:+256776401100". */
export function telHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

/** All site phone numbers as tap-to-call links, joined by `sep`. */
export function Phones({ sep = " or ", className }: { sep?: ReactNode; className?: string }) {
  return (
    <>
      {CONFIG.phones.map((p, i) => (
        <span key={p}>
          {i > 0 && sep}
          <a href={telHref(p)} className={cn("whitespace-nowrap font-medium text-brand hover:text-brand-hover", className)}>
            {p}
          </a>
        </span>
      ))}
    </>
  );
}

/** Page-width container: 1400px max, fluid side padding. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1400px] px-[clamp(16px,4vw,24px)]", className)} {...props} />;
}

export function Eyebrow({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 text-[11.5px] font-semibold uppercase tracking-[.2em] text-brass before:h-px before:w-7 before:bg-brass before:content-[''] mportrait:justify-center mportrait:before:hidden",
        className,
      )}
      {...props}
    />
  );
}

export function FieldLabel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("text-[10.5px] font-semibold uppercase tracking-[.16em] text-stone-500", className)}
      {...props}
    />
  );
}

/** Underlined filter tabs (apartment and services filters). */
export function Tabs<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div data-m-row className={cn("flex max-w-full min-w-0 flex-wrap justify-center gap-[18px]", className)}>
      {options.map((o) => {
        const on = o === value;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            aria-pressed={on}
            className={cn(
              "h-[34px] border-b px-1 text-[12px] uppercase tracking-[.14em]",
              on ? "border-brass font-semibold text-brand" : "border-transparent text-stone-500 hover:text-stone-800",
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function CurrencyToggle() {
  const { currency, setCurrency } = useBooking();
  const opts: { c: Currency; label: string }[] = [
    { c: "USD", label: "USD $" },
    { c: "UGX", label: "UGX USh" },
  ];
  return (
    <div className="flex flex-none gap-1 rounded-full border border-stone-200 bg-white p-[3px]" role="group" aria-label="Currency">
      {opts.map(({ c, label }) => (
        <button
          key={c}
          type="button"
          aria-pressed={currency === c}
          onClick={(e) => {
            e.stopPropagation();
            setCurrency(c);
          }}
          className={cn(
            "h-[26px] whitespace-nowrap rounded-full px-[11px] text-[11.5px]",
            currency === c ? "bg-brand font-semibold text-stone-50" : "text-stone-500 hover:text-stone-900",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function StepperButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "grid size-7 place-items-center rounded-full border border-stone-300 bg-white leading-none text-stone-800 transition-colors hover:border-brand hover:text-brand",
        className,
      )}
      {...props}
    />
  );
}

export function GuestStepper({ size = "sm" }: { size?: "sm" | "lg" }) {
  const { incGuests, decGuests } = useBooking();
  const lg = size === "lg";
  // Smaller on phones (below 640px), full size from tablets up.
  const cls = lg ? "size-9 sm:size-12" : "size-8 sm:size-10";
  const icon = lg ? 24 : 20;
  return (
    <div className="flex flex-none gap-1.5 sm:gap-2">
      <StepperButton className={cls} onClick={decGuests} aria-label="Fewer guests">
        <StepIcon size={icon} />
      </StepperButton>
      <StepperButton className={cls} onClick={incGuests} aria-label="More guests">
        <StepIcon size={icon} plus />
      </StepperButton>
    </div>
  );
}

/** Thin-stroke minus / plus, drawn rather than typed so the weight is even. */
function StepIcon({ size, plus = false }: { size: number; plus?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" aria-hidden="true" className="max-sm:size-4">
      <path d="M5 12h14" />
      {plus && <path d="M12 5v14" />}
    </svg>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-[7px] whitespace-nowrap text-[13.5px] text-stone-600 hover:text-brand"
    >
      <ChevronLeft />
      {children}
    </Link>
  );
}

export function StatusBadge({ status }: { status: "pending" | "confirmed" | "declined" | "cancelled" }) {
  const styles = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-brand-tint text-brand",
    declined: "bg-red-50 text-red-700",
    cancelled: "bg-stone-100 text-stone-500",
  }[status];
  return (
    <span
      className={cn(
        "whitespace-nowrap rounded-full px-[9px] py-[5px] text-[11px] font-semibold uppercase tracking-[.06em]",
        styles,
      )}
    >
      {status}
    </span>
  );
}
