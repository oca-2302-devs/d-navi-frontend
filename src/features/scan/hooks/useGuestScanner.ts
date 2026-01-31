"use client";

import { useRouter } from "next/navigation";

import useScanner from "./useScanner";
import type { HandleError, HandleScan } from "./useScanner";

export interface UseGuestScannerProps {
  goto: string;
}

export interface UseGuestScannerReturn {
  isScanning: boolean;
  handleGuestScan: HandleScan;
  handleGuestError: HandleError;
}

export default function useGuestScanner(options?: UseGuestScannerProps): UseGuestScannerReturn {
  const router = useRouter();

  const onSuccess = () => {
    router.push(options?.goto || "/");
  };

  const { isScanning, handleScan, handleError } = useScanner({ onSuccess });

  return { isScanning, handleGuestScan: handleScan, handleGuestError: handleError };
}
