import Image from "next/image";
import Link from "next/link";

import { whatsappUrl } from "@/lib/booking";
import { CONFIG, NAV_ITEMS } from "@/lib/data";
import { SITE, SITE_PLACE } from "@site";

const head = "text-[11px] font-semibold uppercase tracking-[.2em] text-brass";
const link = "text-stone-50/75 transition-colors hover:text-stone-50";

const SOCIAL_ICONS: Record<string, string> = {
  instagram:
    "M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zM17 5.8a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 3c-2.4 0-2.7 0-3.7.06C5 3.2 3.2 5 3.06 8.3 3 9.3 3 9.6 3 12s0 2.7.06 3.7C3.2 19 5 20.8 8.3 20.94c1 .05 1.3.06 3.7.06s2.7 0 3.7-.06c3.3-.15 5.1-1.95 5.24-5.24.05-1 .06-1.3.06-3.7s0-2.7-.06-3.7C20.8 5 19 3.2 15.7 3.06 14.7 3 14.4 3 12 3z",
  tiktok:
    "M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v2.6c-1.4.1-2.6-.3-3.9-1.1v5.3c0 6.4-7.1 8.4-9.9 3.8-1.8-3-.7-8.2 5.2-8.4v2.8c-.4.1-.9.2-1.3.3-1.3.4-2.1 1.3-1.9 2.9.5 3 6 3.9 5.6-2V3h2.3z",
  facebook: "M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.4V21h3.1z",
};

/** Four columns on wide screens (brand, explore, contact, stay), stacked and centred on phones. */
export function SiteFooter() {
  const socials = Object.entries(SITE.socials).filter(([, url]) => url);
  return (
    <footer className="mt-auto max-sm:group-data-[bookbar]/shell:pb-[84px] bg-brand text-stone-50">
      <div className="mx-auto grid max-w-[1400px] gap-x-10 gap-y-12 px-[clamp(16px,4vw,24px)] pt-[clamp(56px,8vw,96px)] pb-12 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1.2fr_1.2fr] mportrait:text-center">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 text-stone-50 hover:text-stone-50">
            <Image src={SITE.logo} alt="" width={34} height={34} className="size-[34px] object-contain brightness-0 invert" />
            <span className="font-display text-[30px] font-medium">{SITE.wordmark}</span>
          </Link>
          <p className="mt-4 max-w-[34ch] text-[14.5px] leading-[1.7] text-stone-50/70 mportrait:mx-auto">{SITE.tagline}</p>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-2.5 mportrait:justify-center">
              {socials.map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="grid size-10 place-items-center rounded-full border border-stone-50/25 text-stone-50 transition-colors hover:border-stone-50 hover:bg-stone-50 hover:text-brand"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={SOCIAL_ICONS[name] ?? ""} />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>

        <nav aria-label="Footer">
          <div className={head}>Explore</div>
          <ul className="mt-5 grid gap-3 text-[15px]">
            {NAV_ITEMS.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={link}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <div className={head}>Get in touch</div>
          <ul className="mt-5 grid gap-3 text-[15px]">
            {SITE.contact.phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/[^+\d]/g, "")}`} className={link}>
                  {p}
                </a>
              </li>
            ))}
            <li>
              <a href={whatsappUrl([])} target="_blank" rel="noopener noreferrer" className={link}>
                WhatsApp {CONFIG.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONFIG.email}`} className={`${link} break-all`}>
                {CONFIG.email}
              </a>
            </li>
            <li className="text-stone-50/75">{SITE_PLACE}</li>
          </ul>
        </div>

        <div>
          <div className={head}>Plan your stay</div>
          <p className="mt-5 text-[15px] leading-[1.7] text-stone-50/75">
            Pick your dates and see what&apos;s free — booking takes about two minutes.
          </p>
          <Link
            href="/stays"
            data-m-btn
            className="mt-6 inline-flex h-12 items-center justify-center border border-stone-50/40 px-7 text-[12px] font-semibold uppercase tracking-[.16em] text-stone-50 transition-colors hover:border-stone-50 hover:bg-stone-50 hover:text-brand"
          >
            Check availability
          </Link>
        </div>
      </div>

      <div className="border-t border-stone-50/15">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-[clamp(16px,4vw,24px)] py-6 text-[12.5px] text-stone-50/60 mportrait:flex-col mportrait:justify-center mportrait:text-center">
          <span>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </span>
          <span>
            Website done by Hwezah |{" "}
            <a href="tel:+256742696353" className="text-stone-50/60 hover:text-stone-50">
              0742696353
            </a>
          </span>
          <div className="flex gap-5">
            <Link href="/policies" className="text-stone-50/60 hover:text-stone-50">
              Policies
            </Link>
            <Link href="/policies#privacy" className="text-stone-50/60 hover:text-stone-50">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
