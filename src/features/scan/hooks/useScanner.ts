"use client";

import { useCallback, useState } from "react";

import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";

export interface HandleScan {
  (results: IDetectedBarcode[]): void;
}

export interface HandleError {
  (err: unknown): void;
}

export interface UseScannerProps {
  onSuccess?: (results: IDetectedBarcode[]) => void;
  onError?: (err: unknown) => void;
}

export interface UseScannerReturn {
  isScanning: boolean;
  handleScan: HandleScan;
  handleError: HandleError;
}

/**
 * QRコードスキャンの基本機能を提供するフック
 * 位置情報保存やトースト通知は呼び出し側の責務として分離
 */
export default function useScanner(options?: UseScannerProps): UseScannerReturn {
  const [isScanning, setIsScanning] = useState(true);

  const handleScan = useCallback(
    (results: IDetectedBarcode[]): void => {
      if (results.length === 0 || !results[0].rawValue) {
        return;
      }

      setIsScanning(false);

      if (options?.onSuccess) {
        options.onSuccess(results);
      }
    },
    [options]
  );

  const handleError = useCallback(
    (err: unknown) => {
      if (process.env.NODE_ENV === "development") {
        console.error("Scanner Error:", err);
      }

      if (options?.onError) {
        options.onError(err);
      }
    },
    [options]
  );

  return { isScanning, handleScan, handleError };
}
