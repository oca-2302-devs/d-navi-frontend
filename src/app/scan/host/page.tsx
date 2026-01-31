import type { Metadata } from "next";

import { HostScanContainer } from "@/features/scan/components";

export const metadata: Metadata = {
  title: "Host Scan",
};

export default function HostScanPage() {
  return <HostScanContainer />;
}
