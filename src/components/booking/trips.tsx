"use client";

import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/site/field";
import { WhatsAppIcon } from "@/components/site/icon";
import { Container, HostAvatar, StatusBadge } from "@/components/site/ui";
import { useBooking } from "@/context/booking-context";
import { datesLabel, fmtDate, guestsLabel, whatsappUrl } from "@/lib/booking";
import { getApartment } from "@/lib/data";
import { downloadIcs } from "@/lib/ics";
import { SITE } from "@site";

export function Trips() {
  const { orders, hydrated, cancelOrder } = useBooking();
  const next = orders.find((o) => o.status === "confirmed" || o.status === "pending");
  const btn = "h-[38px] rounded-[10px] border border-stone-200 bg-white px-4 text-[13.5px] hover:bg-stone-100";

  return (
    <main>
      <Container className="pt-[clamp(28px,5vw,48px)] pb-24">
        <div data-m-center>
          <h1 className="font-display text-[clamp(27px,5vw,52px)] tracking-[-.02em]">Your trips</h1>
        </div>

        <div className="mt-7 flex flex-wrap items-start gap-[clamp(24px,3.5vw,44px)]">
          <div className="grid min-w-0 flex-[1.5_1_300px] gap-[18px]">
            {hydrated && orders.length === 0 && (
              <div className="rounded-[8px] border border-dashed border-stone-300 bg-white p-11 text-center">
                <div className="text-base font-semibold">No trips booked yet</div>
                <div className="mt-2 text-sm text-stone-500">
                  Pick dates on any apartment and your reservation shows up here.
                </div>
                <Link
                  href="/stays"
                  className="mt-5 inline-flex h-[42px] items-center rounded-[11px] bg-brand px-5 text-sm font-medium text-stone-50 hover:bg-brand-hover hover:text-stone-50"
                >
                  Browse stays
                </Link>
              </div>
            )}

            {orders.map((o) => {
              const a = getApartment(o.apartmentId);
              const live = o.status === "pending" || o.status === "confirmed";
              return (
                <div key={o.ref} className="overflow-hidden rounded-[8px] border border-stone-200 bg-white">
                  <div className="flex flex-wrap">
                    <div className="relative min-h-[190px] w-full max-w-full flex-[1_1_240px]">
                      <Image src={a.images[0]} alt={a.name} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-[2_1_320px] p-[clamp(13px,3.2vw,24px)]">
                      <div className="flex items-center gap-2.5">
                        <StatusBadge status={o.status} />
                        <span className="text-[12.5px] text-stone-400">{o.ref}</span>
                      </div>
                      <div className="mt-3 text-[19px] font-semibold tracking-[-.01em]">{o.apartment}</div>
                      <div className="mt-1 text-sm text-stone-500">
                        {a.loc} · {datesLabel(o.checkIn, o.checkOut)} · {guestsLabel(o.guests)} · {o.amountLabel}
                      </div>
                      {live && (
                        <div className="mt-[18px] flex flex-wrap gap-2">
                          <button type="button" className={btn} onClick={() => downloadIcs(o)}>
                            Add to calendar
                          </button>
                          <a
                            className={`${btn} inline-flex items-center text-stone-900 hover:text-stone-900`}
                            href={whatsappUrl([`Hello ${SITE.host.firstName} — a question about booking ${o.ref} (${o.apartment}).`])}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Message {SITE.host.firstName}
                          </a>
                          <button type="button" className={`${btn} text-red-700 hover:bg-red-50`} onClick={() => cancelOrder(o.ref)}>
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <Card className="rounded-[8px]">
              <div className="text-base font-semibold">Check-in details</div>
              <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-[18px]">
                {[
                  { label: "Check in", value: `${fmtDate(next?.checkIn, true) || "TBD"} · after 2pm` },
                  { label: "Check out", value: `${fmtDate(next?.checkOut, true) || "TBD"} · 11am` },
                  { label: "Door code", value: next?.status === "confirmed" ? "Sent 24h before arrival" : "—" },
                  { label: "Parking", value: "Secure parking space" },
                ].map((f) => (
                  <div key={f.label}>
                    <div className="text-[11px] font-semibold uppercase tracking-[.06em] text-stone-500">{f.label}</div>
                    <div className="mt-1.5 text-[14.5px]">{f.value}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="flex-[1_1_300px] rounded-[8px] p-[clamp(13px,3.2vw,22px)] md:sticky md:top-[92px]">
            <div className="flex items-center gap-[11px]">
              <HostAvatar size={40} />
              <div className="min-w-0 flex-1">
                <div className="whitespace-nowrap text-[14.5px] font-semibold">{SITE.host.firstName} · Host</div>
                <div className="text-[12.5px] text-stone-500">Replies on WhatsApp, 7am–10pm</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-[1.6] text-stone-600">
              Questions about check-in, early arrival or extra services? Message {SITE.host.firstName} directly — replies usually come
              within the hour.
            </p>
            <a
              href={whatsappUrl([`Hello ${SITE.host.firstName} — I have a question about my stay at ${SITE.name}.`])}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-stone-900 text-[13.5px] text-stone-50 hover:bg-stone-800 hover:text-stone-50"
            >
              <WhatsAppIcon />
              Message on WhatsApp
            </a>
            <p className="mt-3 text-xs leading-[1.5] text-stone-400">
              Trips are saved in this browser for now.
            </p>
          </Card>
        </div>
      </Container>
    </main>
  );
}
