"use client";

import { useCallback, useState } from "react";

import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { toast } from "sonner";

import { ONE_HOUR_MS } from "@/shared/constants";
import { saveLocalStorage, STORAGE_KEYS } from "@/shared/lib/storage";

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

export default function useScanner(options?: UseScannerProps): UseScannerReturn {
  const [isScanning, setIsScanning] = useState(true);

  const handleScan = useCallback(
    (results: IDetectedBarcode[]): void => {
      if (results.length === 0) {
        toast("有効なQRコードが見つかりませんでした");
        return;
      }

      const { rawValue: value } = results[0];

      if (!value) {
        toast("QRコードの読み取りに失敗しました");
        return;
      }

      try {
        // TODO: 位置情報のハードコーディングは一時的な実装。本来はバックエンドから取得する。
        const currentLocation = { floor: 1, x: 6, y: 6 };
        const currentLocationString = JSON.stringify(currentLocation);

        // LocalStorageにした理由は、現在地がクライアントに見えても問題ないため。
        saveLocalStorage({
          key: STORAGE_KEYS.LOCATION.CURRENT,
          value: currentLocationString,
          maxAge: ONE_HOUR_MS,
        });
      } catch {
        toast("位置情報の取得に失敗しました");
        return;
      }

      if (options?.onSuccess) {
        options.onSuccess(results);
      }

      setIsScanning(false);
      toast.success("QRコードを正常にスキャンしました");
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

      toast("スキャン中にエラーが発生しました");
    },
    [options]
  );

  return { isScanning, handleScan, handleError };
}
