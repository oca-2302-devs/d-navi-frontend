import React from "react";

import { NodeType } from "../types";

/**
 * ノードタイプに基づいてマップノードのスタイル設定を取得する
 * @param type - ノードのタイプ (elevator, stairs, room など)
 * @returns fill と stroke プロパティを含むスタイルオブジェクト
 */
export function getNodeStyle(type: NodeType): React.CSSProperties {
  switch (type) {
    case "elevator":
      return { fill: "#bfdbfe" }; // blue-200
    case "stairs":
      return { fill: "#fde68a" }; // amber-200
    case "toilet":
      return { fill: "#99f6e4" }; // teal-200
    case "room":
    case "library":
      return { fill: "#f3f4f6", stroke: "#d1d5db" }; // gray-100, gray-300
    case "intersection":
      return { fill: "transparent", stroke: "none" };
    case "exit":
      return { fill: "#bbf7d0" }; // green-200
    case "parking":
      return { fill: "#e2e8f0" }; // slate-200
    default:
      return { fill: "#f3f4f6" }; // gray-100
  }
}
