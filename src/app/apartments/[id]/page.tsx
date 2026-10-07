import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingCard } from "@/components/booking/booking-card";
import { PhotoButton } from "@/components/site/lightbox";
import { RoomReviews } from "@/components/reviews/room-reviews";
import { PhotoCarousel } from "@/components/site/photo-carousel";
import { Container, HostAvatar } from "@/components/site/ui";
import { APARTMENTS, CONFIG, REVIEWS, fullSpecs, listedAmenities } from "@/lib/data";
import { SITE } from "@site";

export function generateStaticParams() {
  return APARTMENTS.map((a) => ({ id: a.id }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/apartments/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const a = APARTMENTS.find((x) => x.id === id);
  if (!a) return {};
  return {
    title: a.name,
    description: `${a.name} in ${a.loc} — ${a.sleeps}, USD ${a.price}/night.`,
    openGraph: { images: [{ url: a.images[0] }] },
  };
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display mt-12 text-[clamp(26px,3vw,34px)] font-medium mportrait:text-center">{children}</h2>;
}

/** Two-column list of label / value rows with a hairline under each, like a spec sheet. */
function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="mt-4 grid gap-x-10 sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 border-b border-stone-200 py-3 text-[14.5px]">
          <dt className="text-stone-500">{k}</dt>
          <dd className="text-right text-stone-900">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function ApartmentPage(props: PageProps<"/apartments/[id]">) {
  const { id } = await props.params;
  const a = APARTMENTS.find((x) => x.id === id);
  if (!a) notFound();
  const h = SITE.house;

  return (
    <main>
      {/* Full-width photo with the apartment name; tap to open the album. */}
      <PhotoButton
        album={a.gallery}
        index={0}
        label={`View photos of ${a.name}`}
        className="relative isolate flex min-h-[80svh] w-full items-end justify-center overflow-hidden bg-stone-900"
      >
        <Image src={a.images[0]} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
        <span className="absolute inset-0 -z-10 bg-stone-900/35" />
        <span className="font-display mb-[clamp(32px,7vw,96px)] px-4 text-center text-[clamp(44px,8vw,110px)] font-medium leading-none text-stone-50">
          {a.name}
        </span>
      </PhotoButton>

      <Container className="pt-[clamp(32px,6vw,72px)] pb-[clamp(48px,8vw,96px)]">
        <div className="grid items-start gap-[clamp(32px,5vw,72px)] lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,1fr)]">
          <div className="min-w-0">
            <div data-m-center>
              <div className="text-[15px]">
                <span className="text-[20px] font-semibold">USD {a.price}</span>
                <span className="text-stone-500"> / night</span>
              </div>
              <h1 className="font-display mt-1 text-[clamp(36px,4.6vw,56px)] font-medium leading-tight">{a.name}</h1>
              <p className="mt-5 max-w-[62ch] text-[15.5px] leading-[1.75] text-stone-600">{a.desc}</p>
            </div>

            <Heading>The space</Heading>
            <Rows
              rows={[
                ["Area", a.specs.area],
                ["Guests", a.specs.guests.replace(/\D+/g, "")],
                ["Bedrooms", a.specs.beds.replace(/\D+/g, "")],
                ["Bathrooms", a.specs.baths.replace(/\D+/g, "")],
              ]}
            />

            <Heading>Amenities</Heading>
            <ul className="mt-4 grid gap-x-10 sm:grid-cols-2">
              {[...fullSpecs(a).map((s) => s.label), ...listedAmenities(a)]
                .filter((x, i, all) => all.indexOf(x) === i && !Object.values(a.specs).includes(x))
                .map((x) => (
                  <li key={x} className="border-b border-stone-200 py-3 text-[14.5px] text-stone-700">
                    {x}
                  </li>
                ))}
            </ul>

            <Heading>Good to know</Heading>
            <Rows
              rows={[
                ["Check-in", h.checkIn],
                ["Check-out", h.checkOut],
                ["Pets", h.pets],
                ["Smoking", h.smoking],
                ["Children", h.children],
                ["Parties", h.parties],
              ]}
            />
            <p className="mt-4 text-[13.5px] leading-[1.6] text-stone-500 mportrait:text-center">
              {h.note}{" "}
              <Link href="/policies" className="font-medium text-brand hover:text-brand-hover">
                Read the policies
              </Link>
            </p>

            <Heading>Reviews</Heading>
            <RoomReviews apartmentId={a.id} apartmentName={a.name} samples={REVIEWS} />

            <div className="mt-10 flex items-center gap-[13px] mportrait:flex-col mportrait:text-center">
              <HostAvatar size={54} />
              <div>
                <div className="text-[15px] font-semibold">Hosted by {SITE.host.firstName}</div>
                <div className="mt-[3px] text-[13.5px] text-stone-500">{SITE.host.role} · replies on WhatsApp</div>
                <a href={`mailto:${CONFIG.founderEmail}`} className="mt-1 inline-block break-all text-[13.5px] font-medium text-brand hover:text-brand-hover">
                  {CONFIG.founderEmail}
                </a>
              </div>
            </div>
          </div>

          <BookingCard apartmentId={a.id} />
        </div>
      </Container>

      <PhotoCarousel photos={a.gallery} />
    </main>
  );
}
