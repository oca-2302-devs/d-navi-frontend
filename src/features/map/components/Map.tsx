import { useCallback, useMemo, useState } from "react";

import { cn } from "@/shared/lib/utils";

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

  // 現在のフロアのノードをフィルタリング
  const floorNodes = useMemo(() => {
    return MOCK_NODES.filter((node) => node.floor === currentLevel);
  }, [currentLevel]);

  const handleNodeClick = useCallback((node: Node) => {
    console.log("Clicked node:", node);
  }, []);

  return (
    <div className={cn("relative w-full h-[600px]", className)}>
      {/* マップ表示 */}
      <FloorMap
        floor={currentLevel}
        nodes={floorNodes}
        hostPath={hostPath}
        guestPath={guestPath}
        onNodeClick={handleNodeClick}
      />

      {/* ナビゲーションコントロール */}
      <FloorNavigation currentLevel={currentLevel} onLevelChange={setCurrentLevel} />
    </div>
  );
}
