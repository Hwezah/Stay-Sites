"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { PriceRows } from "@/components/booking/price-rows";
import { Calendar } from "@/components/site/calendar";
import { WhatsAppIcon } from "@/components/site/icon";
import { FieldLabel, GuestStepper } from "@/components/site/ui";
import { useBooking } from "@/context/booking-context";
import { useUI } from "@/context/ui-context";
import { fmtDate, guestsLabel, whatsappUrl } from "@/lib/booking";
import { SERVICES, type ApartmentId } from "@/lib/data";
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

  const extras = SERVICES.filter((x) => x.cat === "Services");

  return (
    <div className="min-w-0 border border-stone-200 bg-white p-[clamp(18px,3.4vw,32px)] lg:sticky lg:top-[104px]">
      <h2 className="font-display text-center text-[clamp(26px,3vw,34px)] font-medium">Booking inquiry</h2>
      <p className="mt-1.5 text-center text-[13.5px] text-stone-500">Pick your dates — you won&apos;t be charged yet.</p>

      <button type="button" data-keep-open onClick={() => togglePanel("cal-detail")} className="mt-6 grid w-full grid-cols-2 gap-5 text-left">
        {(["checkIn", "checkOut"] as const).map((k) => (
          <div key={k} className="border-b border-stone-200 pb-2.5">
            <FieldLabel className="text-[10.5px]">{k === "checkIn" ? "Check in" : "Check out"}</FieldLabel>
            <div className={cn("font-display mt-1 text-[20px]", dateColor)}>{fmtDate(b[k]) || "Select date"}</div>
          </div>
        ))}
      </button>
      {panel === "cal-detail" && (
        <div className="mt-3 border border-stone-200 p-3.5" data-keep-open>
          <Calendar compact onDone={closePanels} />
        </div>
      )}

      <div className="mt-5 flex items-end justify-between border-b border-stone-200 pb-2.5">
        <div>
          <FieldLabel className="text-[10.5px]">Guests</FieldLabel>
          <div className="font-display mt-1 text-[20px]">{guestsLabel(b.guests)}</div>
        </div>
        <GuestStepper />
      </div>

      <FieldLabel className="mt-6 text-[10.5px]">Additional services</FieldLabel>
      <div className="mt-2 grid gap-2.5 border-b border-stone-200 pb-5">
        {extras.map((x) => {
          const on = b.cartItems.some((c) => c.title === x.title);
          return (
            <label key={x.title} className="flex cursor-pointer items-center gap-3 text-[14.5px] text-stone-700">
              <input type="checkbox" checked={on} onChange={() => b.toggleCartItem(x.title)} className="size-[18px] accent-brand" />
              <span className="flex-1">{x.title}</span>
              <span className="text-[13.5px] text-stone-500">{b.money(x.amount ?? 0)}</span>
            </label>
          );
        })}
      </div>

      <div className="mt-5 flex items-baseline justify-between">
        <span className="font-display text-[24px]">Total price</span>
        <span className="text-[20px] font-semibold">{b.money(hasDates ? b.grandTotal : b.extrasTotal)}</span>
      </div>
      {(hasDates || b.cartItems.length > 0) && (
        <div className="mt-3 grid gap-2">
          <PriceRows />
        </div>
      )}

      <button
        type="button"
        onClick={reserve}
        className="mt-5 h-[52px] w-full bg-brand text-[15px] font-medium text-stone-50 hover:bg-brand-hover"
      >
        Book a Stay
      </button>
      <button
        type="button"
        onClick={bookWhatsApp}
        className="mt-2.5 flex h-11 w-full items-center justify-center gap-2 text-sm font-medium text-brand hover:text-brand-hover"
      >
        <WhatsAppIcon />
        Or book on WhatsApp
      </button>
    </div>
  );
}
