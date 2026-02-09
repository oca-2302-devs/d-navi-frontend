import { motion } from "framer-motion";

import { edgeDrawVariants } from "../constants/animations";
import { buildSvgPath } from "../lib/pathUtils";
import { Position } from "../types";

interface MapEdgeProps {
  path: Position[]; // 座標のシーケンス
  color?: string;
  width?: number;
  dashed?: boolean;
}

export function MapEdge({
  path,
  color = "#F43F5E", // rose-500
  width = 4,
  dashed = false,
}: MapEdgeProps) {
  if (path.length < 2) return null;

  // ポイントをSVGパスコマンドに変換
  const d = buildSvgPath(path);

  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? "8 4" : "none"}
      initial="hidden"
      animate="visible"
      variants={edgeDrawVariants}
    />
  );
}
