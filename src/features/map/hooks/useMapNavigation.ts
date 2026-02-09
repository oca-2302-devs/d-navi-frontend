"use client";

import { useMemo, useState } from "react";

import { MOCK_EDGE_DATA } from "../constants";
import { getNextFloor } from "../lib/pathUtils";

import { useNodes } from "./useNodes";

export function useMapNavigation(showRoute: boolean = true) {
  const [currentLevel, setCurrentLevel] = useState<number>(1);

  // Fetch nodes from AppSync
  const { nodes, loading, error } = useNodes();

  // デモ用、ホスト/ゲストパスの切り替えまたはパスなし
  // サンプル通り、今はハードコード
  const hostPath = MOCK_EDGE_DATA.host;
  const guestPath = MOCK_EDGE_DATA.guest;

  // 現在のフロアのノードをフィルタリング
  const floorNodes = useMemo(() => {
    return nodes.filter((node) => node.floor === currentLevel);
  }, [nodes, currentLevel]);

  // 次のフロアへの移動があるかチェック
  const nextFloor = useMemo(() => {
    if (!showRoute) return null;

    // ホストまたはゲストのパスから次のフロアを検索
    const hostNext = getNextFloor(nodes, currentLevel, hostPath);
    if (hostNext) return hostNext;

    const guestNext = getNextFloor(nodes, currentLevel, guestPath);
    return guestNext;
  }, [nodes, currentLevel, showRoute, hostPath, guestPath]);

  return {
    currentLevel,
    setCurrentLevel,
    floorNodes,
    nextFloor,
    hostPath,
    guestPath,
    loading,
    error,
  };
}
