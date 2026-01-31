"use client";

import { useRouter } from "next/navigation";

import useScanner from "./useScanner";
import type { HandleError, HandleScan } from "./useScanner";

export interface UseLocationScannerReturn {
  isScanning: boolean;
  handleLocationScan: HandleScan;
  handleLocationError: HandleError;
}

export default function useLocationScanner(): UseLocationScannerReturn {
  const router = useRouter();

  const onSuccess = () => {
    router.push("/map");
  };

  const { isScanning, handleScan, handleError } = useScanner({ onSuccess });

  return {
    isScanning,
    handleLocationScan: handleScan,
    handleLocationError: handleError,
  };
}
