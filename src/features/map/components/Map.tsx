import React, { useState } from "react";

import { MOCK_NODES, MOCK_EDGE_DATA } from "../constants";
import { Node } from "../types";

import { FloorMap } from "./FloorMap";
import { FloorNavigation } from "./FloorNavigation";

interface MapProps {
  className?: string;
  // 実際のアプリでは、これらのpropsは親またはcontextから渡される可能性がある
}

export function Map({ className }: MapProps) {
  const [currentLevel, setCurrentLevel] = useState<number>(1);

  // デモ用、ホスト/ゲストパスの切り替えまたはパスなし
  // サンプル通り、今はハードコード
  const hostPath = MOCK_EDGE_DATA.host;
  const guestPath = MOCK_EDGE_DATA.guest;

  function handleNodeClick(node: Node) {
    console.log("Clicked node:", node);
  }

  return (
    <div className={`relative w-full h-[600px] ${className || ""}`}>
      {/* マップ表示 */}
      <FloorMap
        floor={currentLevel}
        nodes={MOCK_NODES}
        hostPath={hostPath}
        guestPath={guestPath}
        onNodeClick={handleNodeClick}
      />

      {/* ナビゲーションコントロール */}
      <FloorNavigation currentLevel={currentLevel} onLevelChange={setCurrentLevel} />
    </div>
  );
}
