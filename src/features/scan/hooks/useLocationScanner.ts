"use client";

import { useCallback } from "react";

import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useLocationStorage } from "./useLocationStorage";
import type { HandleError, HandleScan } from "./useScanner";
import useScanner from "./useScanner";

export interface UseLocationScannerReturn {
  isScanning: boolean;
  handleLocationScan: HandleScan;
  handleLocationError: HandleError;
}

/**
 * 位置情報スキャンの機能を提供するフック
 * useScanner（スキャン）とuseLocationStorage（保存）を組み合わせて、
 * 位置情報スキャンのワークフロー全体を調整する
 */
export default function useLocationScanner(): UseLocationScannerReturn {
  const router = useRouter();
  const { saveLocation } = useLocationStorage();

  const onSuccess = useCallback(
    (_results: IDetectedBarcode[]) => {
      try {
        // TODO: 位置情報のハードコーディングは一時的な実装。本来はバックエンドから取得する。
        const currentLocation = { floor: 1, x: 6, y: 6 };
        saveLocation(currentLocation);

        toast.success("QRコードを正常にスキャンしました");
        router.push("/map");
      } catch {
        toast.error("位置情報の取得に失敗しました");
      }
    },
    [router, saveLocation]
  );

  const onError = useCallback((_err: unknown) => {
    toast.error("スキャン中にエラーが発生しました");
  }, []);

  const { isScanning, handleScan, handleError } = useScanner({
    onSuccess,
    onError,
  });

  return {
    isScanning,
    handleLocationScan: handleScan,
    handleLocationError: handleError,
  };
}
