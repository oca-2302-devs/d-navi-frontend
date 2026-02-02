"use client";

import { useHostScanner } from "../hooks";

import ScanLayout from "./ScanLayout";

export default function HostScanContainer() {
  const { isScanning, handleHostScan, handleHostError } = useHostScanner();

  return (
    <ScanLayout isScanning={isScanning} handleScan={handleHostScan} handleError={handleHostError} />
  );
}
