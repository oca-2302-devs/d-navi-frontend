"use client";

import { useLocationScanner } from "../hooks";

import ScanLayout from "./ScanLayout";

export default function LocationScanContainer() {
  const { isScanning, handleLocationScan, handleLocationError } = useLocationScanner();

  return (
    <ScanLayout
      isScanning={isScanning}
      handleScan={handleLocationScan}
      handleError={handleLocationError}
    />
  );
}
