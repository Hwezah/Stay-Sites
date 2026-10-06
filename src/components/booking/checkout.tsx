"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PriceRows } from "@/components/booking/price-rows";
import { Card, Field, TextArea, TextInput } from "@/components/site/field";
import { WhatsAppIcon } from "@/components/site/icon";
import { BackLink, GuestStepper, Phones } from "@/components/site/ui";
import { useBooking } from "@/context/booking-context";
import { useUI } from "@/context/ui-context";
import { datesLabel, guestsLabel, whatsappUrl } from "@/lib/booking";
import { BANK_ROWS, CONFIG, PAY_METHODS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SITE } from "@site";

const STEPS = ["Trip", "Details", "Payment"];

export function Checkout() {
  const router = useRouter();
  const { toast } = useUI();
  const b = useBooking();
  const [submitting, setSubmitting] = useState(false);
  const detailHref = `/apartments/${b.apartment.id}`;

  if (!b.hydrated) return <main className="min-h-[60vh]" />;

  if (!b.checkIn || !b.checkOut) {
    return (
      <main data-m-center className="mx-auto w-full max-w-[720px] px-[clamp(16px,4vw,24px)] pt-[clamp(40px,7vw,72px)] pb-24">
        <h1 className="font-display text-[clamp(28px,7.5vw,40px)] tracking-[-.02em]">Pick your dates first</h1>
        <p className="mt-3 text-base leading-[1.6] text-stone-600">
          Choose check-in and check-out on an apartment, then come back here to confirm and pay.
        </p>
        <Link
          href={detailHref}
          data-m-btn
          className="mt-6 inline-flex h-11 items-center rounded-md bg-brand px-5 text-sm font-medium text-stone-50 hover:bg-brand-hover hover:text-stone-50"
        >
          Choose dates for {b.apartment.name}
        </Link>
      </main>
    );
  }

  const splitOn = CONFIG.enableSplitPay && b.split;
  const isMomo = b.payMethod === "Mobile Money";
  const isBank = b.payMethod === "Bank transfer";
  const due = b.money(b.amountDue);

  const submit = () => {
    if (submitting) return;
    if (!isMomo && !isBank) return;
    setSubmitting(true);
    const order = b.submitClaim();
    if (!order) {
      setSubmitting(false);
      return;
    }
    router.push("/checkout/pending");
  };

  const bookWhatsApp = () => {
    window.open(whatsappUrl(b.whatsappLines()), "_blank", "noopener");
    toast("ok", "Opening WhatsApp", `Send the message and ${SITE.host.firstName} will confirm ${b.apartment.name}.`);
  };

  return (
    <main className="mx-auto w-full max-w-[1040px] px-[clamp(16px,4vw,24px)] pt-[clamp(20px,4vw,32px)] pb-24">
      <div data-m-center>
        <BackLink href={detailHref}>Back to {b.apartment.name}</BackLink>
        <h1 className="font-display mt-3.5 text-[clamp(28px,7.5vw,40px)] tracking-[-.02em]">Confirm and pay</h1>
      </div>

      <ol data-m-center className="mt-[26px] flex flex-wrap items-center gap-x-2.5 gap-y-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex min-w-0 items-center gap-2">
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full text-xs font-semibold",
                i < 2 ? "bg-brand text-stone-50" : "border border-stone-200 bg-white text-stone-500",
              )}
            >
              {i + 1}
            </span>
            <span className={cn("whitespace-nowrap text-[13.5px]", i < 2 ? "text-stone-900" : "font-semibold text-stone-500")}>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px w-[18px] flex-none bg-stone-200" />}
          </li>
        ))}
      </ol>

      <div className="mt-7 flex flex-wrap items-start gap-[clamp(24px,3.5vw,44px)]">
        <div className="grid min-w-0 flex-[1.5_1_300px] gap-[18px]">
          <Card>
            <div className="text-base font-semibold">Your trip</div>
            <div className="mt-4 grid gap-3.5">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-medium">Dates</div>
                  <div className="mt-0.5 whitespace-nowrap text-[13.5px] text-stone-500">{datesLabel(b.checkIn, b.checkOut)}</div>
                </div>
                <Link href={detailHref} className="text-[13px] text-brand underline">
                  Edit
                </Link>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-medium">Guests</div>
                  <div className="mt-0.5 whitespace-nowrap text-[13.5px] text-stone-500">{guestsLabel(b.guests)}</div>
                </div>
                <GuestStepper />
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-base font-semibold">Guest details</div>
            <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] gap-3.5">
              <Field label="Full name">
                <TextInput value={b.form.name} onChange={(e) => b.updateForm({ name: e.target.value })} placeholder="Your name" autoComplete="name" />
              </Field>
              <Field label="Email">
                <TextInput
                  type="email"
                  value={b.form.email}
                  onChange={(e) => b.updateForm({ email: e.target.value })}
                  placeholder="Your email"
                  autoComplete="email"
                />
              </Field>
              <Field
                className="col-span-full"
                label={
                  <>
                    Message to host <span className="font-normal text-stone-400">(optional)</span>
                  </>
                }
              >
                <TextArea
                  rows={3}
                  value={b.form.note}
                  onChange={(e) => b.updateForm({ note: e.target.value })}
                  placeholder="Arriving late on Friday — is a lockbox check-in possible?"
                />
              </Field>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold">Payment</div>
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                Encrypted
              </div>
            </div>
            <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Payment method">
              {PAY_METHODS.map((m) => {
                const on = b.payMethod === m.label;
                return (
                  <button
                    key={m.label}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-disabled={m.off}
                    onClick={() => {
                      if (m.off) {
                        toast("hint", `${m.label} isn't live yet`, "Use Mobile Money or a bank transfer for now.");
                        return;
                      }
                      b.setPayMethod(m.label);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md border px-4 py-[13px] text-left",
                      m.off
                        ? "cursor-not-allowed border-stone-200 bg-stone-50 text-stone-400 opacity-65"
                        : on
                          ? "border-brand bg-brand-tint"
                          : "border-stone-200 bg-white",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-[18px] flex-none place-items-center rounded-full border",
                        m.off ? "border-stone-200" : on ? "border-brand" : "border-stone-300",
                      )}
                    >
                      <span className={cn("size-[9px] rounded-full", on && "bg-brand")} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{m.label}</span>
                      <span className="mt-0.5 block text-[12.5px] text-pretty text-stone-500">{m.note}</span>
                    </span>
                    <span
                      className={cn(
                        "ml-auto text-[11px] font-semibold uppercase tracking-[.06em]",
                        m.off ? "text-stone-400" : "text-brand",
                      )}
                    >
                      {m.off ? "Unavailable" : m.tag}
                    </span>
                  </button>
                );
              })}
            </div>

            {isMomo && (
              <div className="mt-[18px] overflow-hidden rounded-md border border-stone-200">
                <div className="border-b border-stone-200 bg-brand-tint px-[18px] py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[.07em] text-brand">Send payment to</div>
                  <div className="mt-[7px] flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    {CONFIG.momo.map((m, i) => (
                      <span key={m.tel} className="flex items-baseline gap-x-2.5">
                        {i > 0 && <span className="text-[13.5px] text-brand">or</span>}
                        <a href={`tel:${m.tel}`} className="text-[22px] font-semibold tracking-[-.01em] text-stone-900 hover:text-brand">
                          {m.network} {m.number}
                        </a>
                      </span>
                    ))}
                    <span className="text-[13.5px] text-brand">{CONFIG.momoName}</span>
                  </div>
                  <div className="mt-2 text-[13.5px] text-stone-700">
                    Send exactly <strong>{due}</strong> from your phone, then submit the form below.
                  </div>
                </div>
                <div className="grid gap-3.5 p-[18px]">
                  <Field label="Your name">
                    <TextInput value={b.form.name} onChange={(e) => b.updateForm({ name: e.target.value })} placeholder="Your name" />
                  </Field>
                  <Field label="Phone number you paid from">
                    <TextInput
                      type="tel"
                      value={b.momoPhone}
                      onChange={(e) => b.setMomoPhone(e.target.value)}
                      placeholder="+256 7XX XXX XXX"
                      autoComplete="tel"
                    />
                  </Field>
                  <div className="text-[12.5px] leading-[1.55] text-stone-500">
                    No account needed. Submitting records your booking as <strong>pending</strong> — {SITE.host.firstName} checks the
                    Mobile Money account and confirms it, and you get an SMS either way.
                  </div>
                </div>
              </div>
            )}

            {isBank && (
              <div className="mt-[18px] grid gap-2.5 rounded-md border border-stone-200 p-[18px]">
                {BANK_ROWS.map((r) => (
                  <div key={r.label} className="flex justify-between gap-4 text-[13.5px]">
                    <span className="text-stone-500">{r.label}</span>
                    <span className="text-right font-medium">{r.value}</span>
                  </div>
                ))}
                <div className="mt-1 text-[12.5px] leading-[1.55] text-stone-500">
                  Use your booking reference as the transfer narration. Same manual confirmation as Mobile Money —
                  transfers usually clear within a few hours.
                </div>
              </div>
            )}

            {CONFIG.enableSplitPay && (
              <div className="mt-[18px] flex items-start gap-2.5">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={b.split}
                  aria-label="Split payment"
                  onClick={() => b.setSplit(!b.split)}
                  className={cn(
                    "mt-px grid size-5 flex-none place-items-center rounded-md border text-xs leading-none",
                    b.split ? "border-brand bg-brand text-stone-50" : "border-stone-300 bg-white text-transparent",
                  )}
                >
                  ✓
                </button>
                <div className="text-[13.5px] leading-[1.5] text-stone-600">
                  Pay {b.money(Math.round(b.grandTotal / 2))} now and the rest 30 days before check-in.
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="sticky top-[92px] min-w-0 flex-[1_1_300px] rounded-[8px] border border-stone-200 bg-white p-[clamp(13px,3.2vw,22px)] shadow-sticky">
          <div className="flex gap-3.5">
            <Image src={b.apartment.images[0]} alt={b.apartment.name} width={78} height={78} className="size-[78px] flex-none rounded-md object-cover" />
            <div className="min-w-0">
              <div className="text-[14.5px] font-semibold">{b.apartment.name}</div>
              <div className="mt-[3px] text-[13px] text-stone-500">{b.apartment.loc}</div>
              <div className="mt-1.5 text-[13px] text-stone-700">94% guest satisfaction</div>
            </div>
          </div>
          <div className="my-[18px] h-px bg-stone-100" />
          <PriceRows />
          <div className="mt-3.5 flex justify-between border-t border-stone-100 pt-3.5 text-base font-semibold">
            <span>{splitOn ? "Due today" : "Total"}</span>
            <span>{due}</span>
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="mt-[18px] h-[46px] w-full rounded-md bg-brand text-[15px] font-medium text-stone-50 hover:bg-brand-hover disabled:cursor-wait disabled:bg-stone-700"
          >
            {submitting ? "Processing…" : isMomo ? `I've sent ${due} — submit` : `I've transferred ${due} — submit`}
          </button>
          <div className="my-3 flex items-center gap-2.5">
            <span className="h-px flex-1 bg-stone-100" />
            <span className="text-[11.5px] text-stone-400">or</span>
            <span className="h-px flex-1 bg-stone-100" />
          </div>
          <button
            type="button"
            onClick={bookWhatsApp}
            className="flex h-[46px] w-full items-center justify-center gap-[9px] rounded-md border border-brand bg-white text-[14.5px] font-medium text-brand hover:bg-brand-tint"
          >
            <WhatsAppIcon size={18} />
            Request booking on WhatsApp
          </button>
          <div className="mt-2 text-xs leading-[1.5] text-stone-500">
            Sends your dates, guests and total straight to {SITE.host.firstName} on WhatsApp ({CONFIG.whatsappDisplay}), who confirms and holds the apartment.
            Or call <Phones className="font-normal" />.
          </div>
          <div className="mt-2 text-xs leading-[1.5] text-stone-500">
            Prefer email? Write to{" "}
            <a href={`mailto:${CONFIG.reservationsEmail}`} className="font-medium text-brand hover:text-brand-hover">
              {CONFIG.reservationsEmail}
            </a>
            .
          </div>
          <div className="mt-3 text-xs leading-[1.5] text-stone-400">
            Free cancellation up to 7 days before check-in. See the full policy under Good to know.
          </div>
        </div>
      </div>
    </main>
  );
}
