"use client";

import { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useRequestJoin } from "@/features/room/api/useRequestJoin";

import { useLocationStorage } from "./useLocationStorage";
import { useScanner } from "./useScanner";
import type { HandleError, HandleScan } from "./useScanner";

export interface UseGuestScannerProps {
  goto: string;
}

export interface UseGuestScannerReturn {
  isScanning: boolean;
  handleGuestScan: HandleScan;
  handleGuestError: HandleError;
}

export function useGuestScanner(options?: UseGuestScannerProps): UseGuestScannerReturn {
  const router = useRouter();
  const { saveLocation } = useLocationStorage();
  const { mutateAsync: requestJoinAsync } = useRequestJoin();
  const params = useSearchParams();

  const onSuccess = async (results: IDetectedBarcode[]) => {
    try {
      const guestNodeId = Number(results[0].rawValue);
      saveLocation(results[0].rawValue);

      if (Number.isNaN(guestNodeId)) {
        toast.error("QRコードの値が不正です");
        return;
      }

      const roomId = params.get("roomId") as string;

      await requestJoinAsync({ roomId, guestNodeID: guestNodeId });
      router.push(options?.goto || "/");
      toast.success("QRコードを正常にスキャンしました");
    } catch (error) {
      console.error("Failed to request join:", error);
      toast.error("部屋への参加リクエストに失敗しました");
    }
  };

  const { isScanning, handleScan, handleError } = useScanner({ onSuccess });

  return { isScanning, handleGuestScan: handleScan, handleGuestError: handleError };
}
