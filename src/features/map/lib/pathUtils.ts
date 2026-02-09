import { Node, PathData, Position } from "../types";

/**
 * パスデータに基づいて、指定されたフロアのパスセグメントを計算する
 * 異なるフロアを横断する際にパスをセグメントに分割する
 */
/**
 * パスデータに基づいて、指定されたフロアのパスセグメントを計算する
 * 異なるフロアを横断する際にパスをセグメントに分割する
 */
export function getPathSegments(nodes: Node[], floor: number, pathData?: PathData): Position[][] {
  if (!pathData?.path || pathData.path.length < 2) return [];

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const segments: Position[][] = [];
  let currentSegment: Position[] = [];

  pathData.path.forEach((nodeId, index) => {
    const node = nodeMap.get(nodeId);
    const isNodeOnFloor = node?.floor === floor;

    if (isNodeOnFloor && node) {
      // ノードはこのフロアにあるので座標を取得
      const center = node.entry ?? {
        x: node.position.x + node.size.width / 2,
        y: node.position.y + node.size.height / 2,
      };

      // 前のノードが別のフロアだった場合、新しいセグメントを開始
      const prevNodeId = index > 0 ? pathData.path[index - 1] : null;
      const prevNode = prevNodeId ? nodeMap.get(prevNodeId) : null;
      const isPrevNodeOnDifferentFloor = prevNode && prevNode.floor !== floor;

      if (isPrevNodeOnDifferentFloor) {
        if (currentSegment.length > 0) {
          segments.push(currentSegment);
        }
        currentSegment = [center];
      } else {
        currentSegment.push(center);
      }
    } else {
      // ノードはこのフロアにない、現在のセグメント終了
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
        currentSegment = [];
      }
    }
  });

  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return segments;
}

/**
 * 位置の配列からSVGパス文字列を構築する
 * @param path - 位置座標の配列
 * @returns "M x1 y1 L x2 y2 ..." 形式のSVGパス文字列
 */
export function buildSvgPath(path: Position[]): string {
  return path.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, "");
}

/**
 * 現在のフロアから次のフロアへの移動がある場合、その階数を返す
 * エレベーターなどでフロア移動が発生する直前のノードにいる場合を検出する
 */
export function getNextFloor(
  nodes: Node[],
  currentFloor: number,
  pathData?: PathData
): number | null {
  if (!pathData || !pathData.path || pathData.path.length < 2) return null;

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // パスを走査して、現在のフロアから別のフロアへの遷移（departure）を探す
  for (let i = 0; i < pathData.path.length - 1; i++) {
    const nodeId = pathData.path[i];
    const node = nodeMap.get(nodeId);

    // 現在のノードがこのフロアにあるかチェック
    if (node && node.floor === currentFloor) {
      const nextNodeId = pathData.path[i + 1];
      const nextNode = nodeMap.get(nextNodeId);

      // 次のノードが別のフロアにある場合、遷移とみなす
      if (nextNode && nextNode.floor !== currentFloor) {
        return nextNode.floor;
      }
    }
  }

  return null;
}
