import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Photos in /public/images are already resized (1024px) and compressed, so serve them as-is from the
  // CDN. Vercel's image optimizer has a monthly cap on the Hobby plan; once it's hit, every new image
  // request fails and photos across the site go blank.
  images: {
    unoptimized: true,
    // Placeholder photos load straight from Pexels until each client's own photos go in.
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
  },
  // The privacy policy and terms now live on one page; keep the old links working.
  async redirects() {
    return [
      { source: "/terms", destination: "/policies", permanent: true },
      { source: "/privacy", destination: "/policies#privacy", permanent: true },
    ];
  },
  // Security headers carried over from the prototype's vercel.json.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
