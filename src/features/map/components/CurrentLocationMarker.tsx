"use client";

import { motion } from "framer-motion";

interface CurrentLocationMarkerProps {
  x: number;
  y: number;
}

/**
 * 現在地マーカーコンポーネント
 * 青い円とパルス効果で現在地を視覚的に表示
 */
export function CurrentLocationMarker({ x, y }: CurrentLocationMarkerProps) {
  return (
    <g>
      {/* 外側のパルスエフェクト */}
      <motion.circle
        cx={x}
        cy={y}
        r={20}
        fill="#3b82f6"
        opacity={0.3}
        animate={{
          r: [15, 25, 15],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 内側の実線円 */}
      <circle cx={x} cy={y} r={12} fill="#3b82f6" stroke="white" strokeWidth={3} />

      {/* 中心のドット */}
      <circle cx={x} cy={y} r={4} fill="white" />
    </g>
  );
}
