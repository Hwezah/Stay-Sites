import type { Order } from "@/context/booking-context";
import { SITE, SITE_PLACE } from "@site";

const stamp = (iso: string) => iso.replace(/-/g, "");

/** Download an all-day calendar event covering the stay. */
export function downloadIcs(order: Order) {
  if (!order.checkIn || !order.checkOut) return;
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${SITE.name}//Booking//EN`,
    "BEGIN:VEVENT",
    `UID:${order.ref}@${SITE.contact.email.split("@")[1]}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART;VALUE=DATE:${stamp(order.checkIn)}`,
    `DTEND;VALUE=DATE:${stamp(order.checkOut)}`,
    `SUMMARY:${SITE.name} · ${order.apartment}`,
    `LOCATION:${SITE_PLACE.replace(/,/g, "\\,")}`,
    `DESCRIPTION:Booking ${order.ref}. Check in after 2pm\\, check out by 11am. ${SITE.contact.phones.join(" / ")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `selah-${order.ref}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
