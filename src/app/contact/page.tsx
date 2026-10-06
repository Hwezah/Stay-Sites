import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { whatsappUrl } from "@/lib/booking";
import { CONFIG } from "@/lib/data";
import { SITE, SITE_PLACE } from "@site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Call ${SITE.contact.phones.join(" or ")}, WhatsApp ${CONFIG.whatsappDisplay}, or email ${CONFIG.email}.`,
};

const icon = {
  phone: "M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z",
  chat: "M20 11.5a8.5 8.5 0 0 1-12.4 7.6L3 20.5l1.4-4.6A8.5 8.5 0 1 1 20 11.5z",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  pin: "M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z",
};

/** Modern split layout: a navy panel with every way to reach us, and the message form beside it. */
export default function ContactPage() {
  const rows: { k: keyof typeof icon; label: string; value: string; href?: string; external?: boolean }[] = [
    ...SITE.contact.phones.map((p) => ({ k: "phone" as const, label: "Call", value: p, href: `tel:${p.replace(/[^+\d]/g, "")}` })),
    { k: "chat", label: "WhatsApp", value: CONFIG.whatsappDisplay, href: whatsappUrl([`Hello ${SITE.name} — `]), external: true },
    { k: "mail", label: "Email", value: CONFIG.email, href: `mailto:${CONFIG.email}` },
    { k: "pin", label: "Find us", value: `${SITE_PLACE} · ${SITE.location.travel}` },
  ];

  return (
    <main className="grid lg:min-h-[calc(100svh-80px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <section className="bg-brand px-[clamp(20px,5vw,72px)] py-[clamp(48px,8vw,96px)] text-stone-50">
        <div data-m-center>
          <div className="text-[11.5px] font-semibold uppercase tracking-[.2em] text-stone-50/70">Contact</div>
          <h1 className="font-display mt-4 text-[clamp(52px,7vw,96px)] font-medium leading-[.95]">Let&apos;s talk.</h1>
          <p className="mt-5 max-w-[38ch] text-[16px] leading-[1.7] text-stone-50/80">
            Questions about a stay, a group booking or something special? Reach us whichever way suits you.
          </p>
        </div>

        <ul className="mt-[clamp(36px,5vw,56px)] border-t border-stone-50/15">
          {rows.map((r) => {
            const inner = (
              <>
                <span className="grid size-11 flex-none place-items-center rounded-full border border-stone-50/25 transition-colors group-hover:border-stone-50 group-hover:bg-stone-50 group-hover:text-brand">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={r.k === "mail" || r.k === "chat" ? "none" : "currentColor"} stroke={r.k === "mail" || r.k === "chat" ? "currentColor" : "none"} strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
                    <path d={icon[r.k]} />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-[.18em] text-stone-50/60">{r.label}</span>
                  <span className="mt-0.5 block break-words text-[clamp(17px,1.6vw,20px)]">{r.value}</span>
                </span>
              </>
            );
            return (
              <li key={r.label + r.value} className="border-b border-stone-50/15">
                {r.href ? (
                  <a
                    href={r.href}
                    {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-4 py-5 text-stone-50 hover:text-stone-50"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="group flex items-center gap-4 py-5">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="px-[clamp(20px,5vw,96px)] py-[clamp(48px,8vw,96px)]">
        <div className="mx-auto max-w-[640px]">
          <h2 data-m-center className="font-display text-[clamp(30px,3.4vw,44px)] font-medium leading-tight">Send us a message</h2>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
