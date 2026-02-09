"use client";

import { Map } from "@/features/map/components";

import { useMapStage, DisplayStage } from "../hooks/useMapStage";

import { LocationConfirmationScreen } from "./LocationConfirmationScreen";
import { MatchingSuccessModal } from "./MatchingSuccessModal";

export function MapContainer() {
  const { displayStage, showMatchingModal, handleMatchingModalClose } = useMapStage();

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
