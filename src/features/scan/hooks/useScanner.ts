"use client";

import { useCallback, useRef, useState } from "react";

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
export function useScanner(options?: UseScannerProps): UseScannerReturn {
  const [isScanning, setIsScanning] = useState(true);
  // コールバックを ref で保持して useCallback の依存配列を安定化
  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);
  onSuccessRef.current = options?.onSuccess;
  onErrorRef.current = options?.onError;

  const handleScan = useCallback((results: IDetectedBarcode[]): void => {
    if (results.length === 0 || !results[0].rawValue) {
      return;
    }

    setIsScanning(false);
    onSuccessRef.current?.(results);
  }, []);

  const handleError = useCallback((err: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.error("Scanner Error:", err);
    }
    onErrorRef.current?.(err);
  }, []);

  return { isScanning, handleScan, handleError };
}
