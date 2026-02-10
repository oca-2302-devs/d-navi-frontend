"use client";

import { useEffect } from "react";

import { useRouter, useParams } from "next/navigation";

import { Map } from "@/features/map/components";

import { useMapStage, DisplayStage } from "../hooks/useMapStage";

import { LocationConfirmationScreen } from "./LocationConfirmationScreen";
import { MatchingSuccessModal } from "./MatchingSuccessModal";

/**
 * マップコンテナコンポーネント
 * 表示段階の管理とルーティングを担当
 */
export function MapContainer() {
  const router = useRouter();
  const params = useParams<{ room_id: string }>();
  const roomId = params.room_id;

  const { displayStage, showMatchingModal, handleMatchingModalClose } = useMapStage();

  // ROUTE_WITH_CURRENT_LOCATION段階に到達したら/meetにルーティング
  useEffect(() => {
    if (displayStage === DisplayStage.ROUTE_WITH_CURRENT_LOCATION) {
      router.replace(`/room/${roomId}/meet`);
    }
  }, [displayStage, router, roomId]);

  // 現在の段階に応じてコンポーネントを表示
  if (displayStage === DisplayStage.LOCATION_CONFIRMATION) {
    return <LocationConfirmationScreen />;
  }

  // CURRENT_LOCATION_ONLY, MATCHING, ROUTE_WITH_CURRENT_LOCATION段階ではマップを表示
  return (
    <div className="h-screen w-full">
      <Map
        className="w-full h-full"
        showRoute={displayStage === DisplayStage.ROUTE_WITH_CURRENT_LOCATION} // 最終段階のみルートを表示
        showCurrentLocation={true}
      />

      <MatchingSuccessModal open={showMatchingModal} onClose={handleMatchingModalClose} />
    </div>
  );
}
