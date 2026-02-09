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
  const {
    currentLevel,
    setCurrentLevel,
    floorNodes,
    nextFloor,
    hostPath,
    guestPath,
    loading,
    error,
  } = useMapNavigation(showRoute);

  // ローディング状態
  if (loading) {
    return (
      <div className={cn("relative w-full h-[600px] flex items-center justify-center", className)}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">マップデータを読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className={cn("relative w-full h-[600px] flex items-center justify-center", className)}>
        <div className="flex flex-col items-center gap-4 text-center max-w-md px-4">
          <div className="rounded-full bg-destructive/10 p-3">
            <svg
              className="h-6 w-6 text-destructive"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">マップデータの読み込みに失敗しました</h3>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }
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
