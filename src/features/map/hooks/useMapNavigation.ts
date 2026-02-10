"use client";

import { useEffect, useMemo, useState } from "react";

import { getRouteData } from "@/shared/lib/storage";

import { useMapNodes } from "../api";
import { getNextFloor } from "../lib/pathUtils";
import { EdgeData, PathData } from "../types";

export function useMapNavigation(showRoute: boolean = true) {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [edgeData, setEdgeData] = useState<EdgeData | null>(null);

  // DynamoDB からノードデータを取得
  const { data: allNodes = [], isLoading } = useMapNodes();

  // localStorage からルートデータを取得
  useEffect(() => {
    if (showRoute) {
      const routeData = getRouteData();
      setEdgeData(routeData);
    }
  }, [showRoute]);

  const hostPath: PathData | undefined = edgeData?.host;
  const guestPath: PathData | undefined = edgeData?.guest;

  // 現在のフロアのノードをフィルタリング
  const floorNodes = useMemo(() => {
    return allNodes.filter((node) => node.floor === currentLevel);
  }, [allNodes, currentLevel]);

  // 次のフロアへの移動があるかチェック
  const nextFloor = useMemo(() => {
    if (!showRoute) return null;

    // ホストまたはゲストのパスから次のフロアを検索
    const hostNext = getNextFloor(allNodes, currentLevel, hostPath);
    if (hostNext) return hostNext;

    const guestNext = getNextFloor(allNodes, currentLevel, guestPath);
    return guestNext;
  }, [allNodes, currentLevel, showRoute, hostPath, guestPath]);

  return {
    currentLevel,
    setCurrentLevel,
    floorNodes,
    nextFloor,
    hostPath,
    guestPath,
    isLoading,
    allNodes,
  };
}
