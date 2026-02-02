import type { Metadata } from "next";

import { LocationScanContainer } from "@/features/scan/components";

export const metadata: Metadata = {
  title: "Location Scan",
};

export default function LocationScanPage() {
  return <LocationScanContainer />;
}
