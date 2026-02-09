"use client";

import { cn } from "@/shared/lib/utils";

import { useMapNavigation } from "../hooks/useMapNavigation";

import { ElevatorNotification } from "./ElevatorNotification";
import { FloorMap } from "./FloorMap";
import { FloorNavigation } from "./FloorNavigation";

interface MapProps {
  className?: string;
  showRoute?: boolean; // ルートを表示するかどうか
  showCurrentLocation?: boolean; // 現在地を表示するかどうか
  // 実際のアプリでは、これらのpropsは親またはcontextから渡される可能性がある
}

/**
 * マップコンポーネント
 * マップの表示とナビゲーションコントロールを担当
 */
export function Map({ className, showRoute = true, showCurrentLocation = true }: MapProps) {
  const { currentLevel, setCurrentLevel, floorNodes, nextFloor, hostPath, guestPath } =
    useMapNavigation(showRoute);

  return (
    <div className={cn("relative w-full h-[600px]", className)}>
      {/* マップ表示 */}
      <FloorMap
        floor={currentLevel}
        nodes={floorNodes}
        hostPath={showRoute ? hostPath : undefined}
        guestPath={showRoute ? guestPath : undefined}
        showCurrentLocation={showCurrentLocation}
        showRoute={showRoute}
      />

      {/* ナビゲーションコントロール */}
      <FloorNavigation currentLevel={currentLevel} onLevelChange={setCurrentLevel} />

      {/* エレベーター案内通知 */}
      <ElevatorNotification nextFloor={nextFloor} />
    </div>
  );
}
