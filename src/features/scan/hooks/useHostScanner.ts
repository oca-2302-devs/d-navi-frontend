"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import useScanner from "./useScanner";
import type { HandleError, HandleScan } from "./useScanner";

export interface UseHostScannerReturn {
  isScanning: boolean;
  handleHostScan: HandleScan;
  handleHostError: HandleError;
}

export default function useHostScanner(): UseHostScannerReturn {
  const router = useRouter();

  const onSuccess = () => {
    // TODO: uuidは一時的な実装。実際にはサーバーから取得する。
    const roomId = uuidv4();
    router.push(`/room/${roomId}/map`);
  };

  const { isScanning, handleScan, handleError } = useScanner({ onSuccess });

  return { isScanning, handleHostScan: handleScan, handleHostError: handleError };
}
