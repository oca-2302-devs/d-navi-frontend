import { Node, PathData, Position } from "../types";

/**
 * パスデータに基づいて、指定されたフロアのパスセグメントを計算する
 * 異なるフロアを横断する際にパスをセグメントに分割する
 */
export function getPathSegments(nodes: Node[], floor: number, pathData?: PathData): Position[][] {
  if (!pathData || !pathData.path || pathData.path.length < 2) return [];

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const segments: Position[][] = [];
  let currentSegment: Position[] = [];

  for (let i = 0; i < pathData.path.length; i++) {
    const nodeId = pathData.path[i];
    const node = nodeMap.get(nodeId);

    if (node && node.floor === floor) {
      // ノードはこのフロアにある
      // 現在のセグメントに追加
      const center = node.entry
        ? node.entry
        : {
            x: node.position.x + node.size.width / 2,
            y: node.position.y + node.size.height / 2,
          };

      // パスの前のノードもこのフロアにあったか、新しいセグメントを開始するかをチェック
      if (i > 0) {
        const prevNodeId = pathData.path[i - 1];
        const prevNode = nodeMap.get(prevNodeId);
        if (prevNode && prevNode.floor !== floor) {
          // 前のノードは別のフロアにあった。新しいセグメントの開始（このフロアへの到着）
          if (currentSegment.length > 0) {
            segments.push(currentSegment);
          }
          currentSegment = [center];
        } else {
          // 前のノードはこのフロアにあった（またはi=0で以下で処理される）
          currentSegment.push(center);
        }
      } else {
        // パスの最初のノード
        currentSegment.push(center);
      }
    } else {
      // ノードはこのフロアにない
      // アクティブなセグメントがあれば閉じる
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
        currentSegment = [];
      }
    }
  }
  // 残りを追加
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
