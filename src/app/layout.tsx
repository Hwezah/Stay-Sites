import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { CSSProperties } from "react";

import { BookBar, ShellPadding } from "@/components/site/book-bar";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { RevealObserver } from "@/components/site/reveal-observer";
import { Toaster } from "@/components/site/toaster";
import { AppProviders } from "@/context/app-providers";
import "./globals.css";
import { SITE } from "@site";

// Fonts are bundled in ./fonts (Latin, variable weight) so builds never depend on downloading them.
const body = localFont({ src: "./fonts/manrope-latin.woff2", variable: "--font-body", weight: "200 800", display: "swap" });
const heading = localFont({
  src: "./fonts/cormorant-garamond-latin.woff2",
  variable: "--font-heading",
  weight: "300 700",
  display: "swap",
});

// Brand colours from content/site.ts, applied over the defaults in globals.css.
const themeVars = {
  "--color-brand": SITE.theme.brand,
  "--color-brand-hover": SITE.theme.brandHover,
  "--color-brand-tint": SITE.theme.brandTint,
  "--color-brand-soft": SITE.theme.brandSoft,
  "--color-page": SITE.theme.page,
  "--color-accent": SITE.theme.accent,
} as CSSProperties;

const description = SITE.seo.description;

// Absolute base for Open Graph URLs. Blank env vars are skipped, and on Vercel
// the deployment's own domain is used when NEXT_PUBLIC_SITE_URL isn't set.
function siteUrl(): URL {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const candidates = [process.env.NEXT_PUBLIC_SITE_URL, vercel && `https://${vercel}`, "http://localhost:3000"];
  for (const c of candidates) {
    if (!c?.trim()) continue;
    try {
      return new URL(c.trim());
    } catch {
      // Ignore malformed values and try the next option.
    }
  }
  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: SITE.seo.title, template: `%s · ${SITE.name}` },
  description,
  openGraph: {
    title: SITE.name,
    description,
    siteName: SITE.name,
    type: "website",
    images: [{ url: SITE.seo.ogImage, width: 1024, height: 768, alt: SITE.name }],
  },
  twitter: { card: "summary_large_image", title: SITE.name, description, images: [SITE.seo.ogImage] },
};

export const viewport: Viewport = { themeColor: SITE.theme.brand };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${body.variable} ${heading.variable}`} style={themeVars}>
      <body>
        <AppProviders>
          <ShellPadding>
            <SiteHeader />
            <div className="flex flex-1 flex-col">{children}</div>
            <SiteFooter />
          </ShellPadding>
          <BookBar />
          <Toaster />
          <RevealObserver />
        </AppProviders>
      </body>
    </html>
  );
}
