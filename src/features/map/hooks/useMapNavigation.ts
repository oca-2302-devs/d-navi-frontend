"use client";

import { useMemo, useState } from "react";

import { MOCK_NODES, MOCK_EDGE_DATA } from "../constants";
import { getNextFloor } from "../lib/pathUtils";

export function useMapNavigation(showRoute: boolean = true) {
  const [currentLevel, setCurrentLevel] = useState<number>(1);

  // デモ用、ホスト/ゲストパスの切り替えまたはパスなし
  // サンプル通り、今はハードコード
  const hostPath = MOCK_EDGE_DATA.host;
  const guestPath = MOCK_EDGE_DATA.guest;

  // 現在のフロアのノードをフィルタリング
  const floorNodes = useMemo(() => {
    return MOCK_NODES.filter((node) => node.floor === currentLevel);
  }, [currentLevel]);

  // 次のフロアへの移動があるかチェック
  const nextFloor = useMemo(() => {
    if (!showRoute) return null;

    // ホストまたはゲストのパスから次のフロアを検索
    const hostNext = getNextFloor(MOCK_NODES, currentLevel, hostPath);
    if (hostNext) return hostNext;

    const guestNext = getNextFloor(MOCK_NODES, currentLevel, guestPath);
    return guestNext;
  }, [currentLevel, showRoute, hostPath, guestPath]);

  return {
    currentLevel,
    setCurrentLevel,
    floorNodes,
    nextFloor,
    hostPath,
    guestPath,
  };
}
