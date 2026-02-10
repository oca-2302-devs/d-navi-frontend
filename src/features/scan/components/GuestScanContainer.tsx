"use client";

import { useGuestScanner } from "../hooks";

import { ScanLayout } from "./ScanLayout";

export function GuestScanContainer({ roomId }: { roomId: string }) {
  const { isScanning, handleGuestScan, handleGuestError } = useGuestScanner({
    goto: `/room/${roomId}/map`,
  });

  return (
    <ScanLayout
      isScanning={isScanning}
      handleScan={handleGuestScan}
      handleError={handleGuestError}
    />
  );
}
