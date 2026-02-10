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
}

/**
 * マップコンポーネント
 * マップの表示とナビゲーションコントロールを担当
 */
export function Map({ className, showRoute = true, showCurrentLocation = true }: MapProps) {
  const { currentLevel, setCurrentLevel, floorNodes, nextFloor, hostPath, guestPath, isLoading } =
    useMapNavigation(showRoute);

  if (isLoading) {
    return (
      <div className={cn("relative w-full h-150 flex items-center justify-center", className)}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
          <p className="text-sm text-gray-500">マップを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-150", className)}>
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
