import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { Container, Phones } from "@/components/site/ui";
import { CONFIG, CONTACT_CARDS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: `Call +256 776 401 100 or +256 751 401 198, WhatsApp ${CONFIG.whatsappDisplay}, or email ${CONFIG.email}.`,
};

export default function ContactPage() {
  return (
    <main>
      <Container className="pt-[clamp(28px,5vw,48px)] pb-24">
        <div data-m-center>
          <h1 className="font-display text-[clamp(27px,5vw,52px)] tracking-[-.02em]">Contact Us</h1>
          <p className="mt-3.5 max-w-[56ch] text-[16.5px] leading-[1.6] text-stone-600">
            We&apos;d love to hear from you! Whether you&apos;re planning your next getaway, have a question about our
            rooms, or need help with a booking, our friendly team is here to help. No question is too small, and no
            request is too big.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-start gap-[clamp(24px,3.5vw,44px)]">
          <ContactForm />
          <div className="grid min-w-0 flex-[1_1_280px] gap-4 md:sticky md:top-[92px]">
            {CONTACT_CARDS.map((c) => (
              <div key={c.label} className="rounded-[6px] border border-stone-200 bg-white p-[clamp(14px,3.4vw,22px)]">
                <div className="text-[11px] font-semibold uppercase tracking-[.07em] text-stone-500">{c.label}</div>
                <div className="mt-2 text-[15.5px] font-medium">
                  {c.phones ? (
                    <Phones sep=" · " className="text-stone-900 hover:text-brand" />
                  ) : c.email && c.value === c.email ? (
                    <a href={`mailto:${c.email}`} className="text-stone-900 hover:text-brand">
                      {c.value}
                    </a>
                  ) : (
                    c.value
                  )}
                </div>
                <div className="mt-[5px] text-[13.5px] leading-[1.5] text-stone-500">{c.note}</div>
                {c.email && c.value !== c.email && (
                  <a
                    href={`mailto:${c.email}`}
                    className="mt-1.5 inline-block break-all text-[13.5px] font-medium text-brand hover:text-brand-hover"
                  >
                    {c.email}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
