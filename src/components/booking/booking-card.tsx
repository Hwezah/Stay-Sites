"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { PriceRows } from "@/components/booking/price-rows";
import { Calendar } from "@/components/site/calendar";
import { WhatsAppIcon } from "@/components/site/icon";
import { CurrencyToggle, FieldLabel, GuestStepper } from "@/components/site/ui";
import { useBooking } from "@/context/booking-context";
import { useUI } from "@/context/ui-context";
import { fmtDate, guestsLabel, whatsappUrl } from "@/lib/booking";
import type { ApartmentId } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SITE } from "@site";

export function BookingCard({ apartmentId }: { apartmentId: ApartmentId }) {
  const router = useRouter();
  const { panel, togglePanel, openPanel, closePanels, toast } = useUI();
  const b = useBooking();
  const { setApartment, hydrated } = b;

  // The detail page decides which apartment the trip is for. Wait for storage
  // hydration so the saved trip doesn't overwrite this choice.
  useEffect(() => {
    if (hydrated) setApartment(apartmentId);
  }, [hydrated, apartmentId, setApartment]);

  const hasDates = !!(b.checkIn && b.checkOut);
  const dateColor = b.checkIn ? "text-stone-900" : "text-stone-400";

  const reserve = () => {
    if (!hasDates) {
      openPanel("cal-detail");
      toast("warn", "Add your dates first", "Select check-in and check-out to reserve.");
      return;
    }
    router.push("/checkout");
  };

  const bookWhatsApp = () => {
    window.open(whatsappUrl(b.whatsappLines()), "_blank", "noopener");
    toast("ok", "Opening WhatsApp", `Send the message and ${SITE.host.firstName} will confirm ${b.apartment.name}.`);
  };

  return (
    <div className="sticky top-[92px] min-w-0 flex-[1_1_320px] rounded-[8px] border border-stone-200 bg-white p-[clamp(13px,3.2vw,22px)] shadow-sticky">
      <div className="flex flex-nowrap items-center justify-between gap-2.5">
        <div className="flex min-w-0 items-baseline gap-[5px]">
          <span className="whitespace-nowrap text-[clamp(19px,5vw,24px)] font-semibold tracking-[-.02em]">
            {b.money(b.apartment.price)}
          </span>
          <span className="text-[13px] text-stone-500">night</span>
        </div>
        <CurrencyToggle />
      </div>

      <div className="mt-4 overflow-hidden rounded-md border border-stone-200">
        <button
          type="button"
          data-keep-open
          onClick={() => togglePanel("cal-detail")}
          className="grid w-full grid-cols-2 text-left"
        >
          <div className="border-r border-stone-200 px-3.5 py-3">
            <FieldLabel className="text-[10.5px]">Check in</FieldLabel>
            <div className={cn("mt-1 text-sm", dateColor)}>{fmtDate(b.checkIn) || "Add date"}</div>
          </div>
          <div className="px-3.5 py-3">
            <FieldLabel className="text-[10.5px]">Check out</FieldLabel>
            <div className={cn("mt-1 text-sm", dateColor)}>{fmtDate(b.checkOut) || "Add date"}</div>
          </div>
        </button>
        <div className="flex items-center justify-between border-t border-stone-200 px-3.5 py-3">
          <div>
            <FieldLabel className="text-[10.5px]">Guests</FieldLabel>
            <div className="mt-1 text-sm">{guestsLabel(b.guests)}</div>
          </div>
          <GuestStepper />
        </div>
      </div>

      {panel === "cal-detail" && (
        <div className="mt-3 rounded-md border border-stone-200 p-3.5" data-keep-open>
          <Calendar compact onDone={closePanels} />
        </div>
      )}

      <button
        type="button"
        onClick={reserve}
        className="mt-4 h-[46px] w-full rounded-md bg-brand text-[15px] font-medium text-stone-50 hover:bg-brand-hover"
      >
        Reserve
      </button>
      <button
        type="button"
        onClick={bookWhatsApp}
        className="mt-2.5 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-stone-200 bg-white text-sm font-medium text-brand hover:border-brand hover:bg-brand-tint"
      >
        <WhatsAppIcon />
        Book on WhatsApp instead
      </button>
      <div className="mt-2.5 text-center text-[12.5px] text-stone-400">You won&apos;t be charged yet</div>

      {hasDates && (
        <div className="mt-[18px] grid gap-2.5 border-t border-stone-100 pt-[18px]">
          <PriceRows />
          <div className="flex justify-between border-t border-stone-100 pt-3 text-[15px] font-semibold">
            <span>Total</span>
            <span>{b.money(b.grandTotal)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
