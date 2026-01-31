import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GuestScanContainer } from "@/features/scan/components";

export const metadata: Metadata = {
  title: "Guest Scan",
};

type Props = {
  searchParams: Promise<{ roomId?: string }>;
};

export default async function GuestScanPage({ searchParams }: Props) {
  const { roomId } = await searchParams;

  if (!roomId) {
    notFound();
  }

  return <GuestScanContainer roomId={roomId} />;
}
