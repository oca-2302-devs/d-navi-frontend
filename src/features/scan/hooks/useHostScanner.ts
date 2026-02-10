"use client";

import { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCreateRoom } from "@/features/room/api/useCreateRoom";

import { ONE_HOUR_MS } from "@/shared/constants";
import { saveLocalStorage, STORAGE_KEYS } from "@/shared/lib/storage";

import { useScanner } from "./useScanner";
import type { HandleError, HandleScan } from "./useScanner";

export interface UseHostScannerReturn {
  isScanning: boolean;
  handleHostScan: HandleScan;
  handleHostError: HandleError;
}

export function useHostScanner(): UseHostScannerReturn {
  const router = useRouter();
  const { mutateAsync: createRoomAsync } = useCreateRoom();

  const onSuccess = async (results: IDetectedBarcode[]) => {
    const rawValue = results?.[0]?.rawValue ?? "";
    const hostNodeID = parseInt(rawValue, 10);

    if (Number.isNaN(hostNodeID)) {
      toast.error("QRコードの値が不正です");
      return;
    }

    try {
      const result = await createRoomAsync({ hostNodeID });

      saveLocalStorage({
        key: STORAGE_KEYS.ROOM.HOST_TOKEN,
        value: result.hostToken,
        maxAge: ONE_HOUR_MS,
      });

      router.push(`/room/${result.room.roomId}/map`);
    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error("部屋の作成に失敗しました");
    }
  };

  const { isScanning, handleScan, handleError } = useScanner({ onSuccess });

  return {
    isScanning,
    handleHostScan: handleScan,
    handleHostError: handleError,
  };
}
