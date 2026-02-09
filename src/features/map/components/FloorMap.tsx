import { memo, useMemo } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { getPathSegments } from "../lib/pathUtils";
import { Node, PathData } from "../types";

import { MapEdge } from "./MapEdge";
import { MapNode } from "./MapNode";

interface FloorMapProps {
  floor: number;
  nodes: Node[];
  hostPath?: PathData;
  guestPath?: PathData;
  onNodeClick?: (node: Node) => void;
}

function FloorMapComponent({ floor, nodes, hostPath, guestPath, onNodeClick }: FloorMapProps) {
  const hostSegments = useMemo(
    () => getPathSegments(nodes, floor, hostPath),
    [nodes, floor, hostPath]
  );
  const guestSegments = useMemo(
    () => getPathSegments(nodes, floor, guestPath),
    [nodes, floor, guestPath]
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-white/50 dark:bg-black/20 rounded-xl shadow-inner backdrop-blur-sm border border-gray-100 dark:border-gray-800">
      <AnimatePresence mode="wait">
        <motion.div
          key={floor}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full h-full"
        >
          {/* SVGビューポート - 標準のviewBoxを使用するか、マップデータの境界に基づいて動的に設定するか？
              モックデータの位置は〜650x500まで。安全なviewBoxを選択。
              600x400は小さすぎる。800x600が良さそう。
          */}
          <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* ノードを先に描画するかエッジを先に描画するか？通常はエッジをノードの下に描画 */}

            {/* ゲストパス（青） */}
            {guestSegments.map((segment, idx) => (
              <MapEdge key={`guest-edge-${idx}`} path={segment} color="#3b82f6" />
            ))}

            {/* ホストパス（ローズ/デフォルト） */}
            {hostSegments.map((segment, idx) => (
              <MapEdge key={`host-edge-${idx}`} path={segment} color="#f43f5e" />
            ))}

            {/* ノード */}
            {nodes.map((node) => {
              const isHostActive = hostPath?.path.includes(node.id);
              const isGuestActive = guestPath?.path.includes(node.id);
              // このノードがいずれかのパスの目的地かをチェック
              const isDestination = hostPath?.end === node.id || guestPath?.end === node.id;

              return (
                <MapNode
                  key={node.id}
                  node={node}
                  onClick={onNodeClick}
                  isActive={isHostActive || isGuestActive}
                  isDestination={isDestination}
                />
              );
            })}
          </svg>
        </motion.div>
      </AnimatePresence>

      {/* フロアラベルオーバーレイ */}
      <div className="absolute top-4 right-4 text-4xl font-bold text-gray-700 dark:text-gray-300 pointer-events-none select-none">
        {floor}F
      </div>
    </div>
  );
}

export const FloorMap = memo(FloorMapComponent);
