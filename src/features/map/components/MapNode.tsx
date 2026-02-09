import { motion } from "framer-motion";

import destinationIconUrl from "@/assets/DestinationIcon.svg";

import { cn } from "@/shared/lib/utils";

import { getNodeStyle } from "../lib/nodeStyles";
import { Node } from "../types";

import { MapNodeIcon } from "./MapNodeIcon";

interface MapNodeProps {
  node: Node;
  onClick?: (node: Node) => void;
  isActive?: boolean; // ハイライト用
  isDestination?: boolean;
}

export function MapNode({ node, onClick, isActive, isDestination }: MapNodeProps) {
  const { position, size, type } = node;

  // 目的地ノードの場合は目的地アイコンをレンダリング
  if (isDestination) {
    const centerX = position.x + size.width / 2;
    const centerY = position.y + size.height / 2;

    const iconSize = 32;
    const x = centerX - iconSize / 2;
    const y = centerY - iconSize / 2;

    // オブジェクト（StaticImageData）と文字列（URL）の両方のimport結果を処理
    // destinationIconUrlが有効な画像ソースを提供すると想定
    const href =
      typeof destinationIconUrl === "string"
        ? destinationIconUrl
        : (destinationIconUrl as { src: string }).src;

    return (
      <motion.g
        initial={{ opacity: 0, scale: 0, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={() => onClick?.(node)}
        className="cursor-pointer hover:opacity-90"
      >
        <image href={href} x={x} y={y} width={iconSize} height={iconSize} />
      </motion.g>
    );
  }

  // 純粋に論理的な交差点の場合はレンダリングをスキップ（目的地の場合は上で処理済み）
  if (type === "intersection") {
    return null;
  }

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick?.(node)}
      className="cursor-pointer hover:opacity-80"
    >
      <rect
        x={position.x}
        y={position.y}
        width={size.width}
        height={size.height}
        style={getNodeStyle(type)}
        className={cn("stroke-1 transition-colors", isActive ? "stroke-rose-500 stroke-2" : "")}
        rx={4} // 角丸
      />
      <MapNodeIcon node={node} isDestination={isDestination} />
    </motion.g>
  );
}
