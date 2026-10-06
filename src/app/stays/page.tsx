import type { Metadata } from "next";

import { StaysResults } from "@/components/stays/stays-results";

export const metadata: Metadata = {
  title: "Available apartments",
  description: "Choose your dates and guests, then pick the apartment that suits your stay.",
};

export default function StaysPage() {
  return <StaysResults />;
}
