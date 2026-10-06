import type { Metadata } from "next";

import { ServicesGrid } from "@/components/services/services-grid";
import { Container, Eyebrow } from "@/components/site/ui";
import { SITE } from "@site";

export const metadata: Metadata = {
  title: "Services & neighbourhood",
  description: `Laundry, cleaning and car wash services at ${SITE.name}, plus the best of ${SITE.location.area} nearby.`,
};

export default function ServicesPage() {
  return (
    <main>
      <Container className="pt-[clamp(28px,5vw,48px)] pb-24">
        <div data-m-center>
          <Eyebrow>Local guide</Eyebrow>
          <h1 className="font-display mt-3 max-w-[20ch] text-[clamp(28px,5.4vw,58px)] tracking-[-.02em]">
            Exclusive additions &amp; the neighbourhood
          </h1>
          <p className="mt-4 max-w-[58ch] text-[16.5px] leading-[1.6] text-stone-600">
            Enhance your stay with laundry, cleaning and car wash services — pricing is provided when you book. Then
            step out and enjoy the best of {SITE.location.area}.
          </p>
        </div>
        <ServicesGrid />
      </Container>
    </main>
  );
}
