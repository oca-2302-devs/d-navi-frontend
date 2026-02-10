import client from "@/lib/amplify";

import { Node, NodeType } from "../types";

/**
 * DynamoDB AttributeValue のマーシャル形式を表す型
 */
type DynamoDBAttributeValue =
  | { S: string }
  | { N: string }
  | { BOOL: boolean }
  | { NULL: boolean }
  | { L: DynamoDBAttributeValue[] }
  | { M: Record<string, DynamoDBAttributeValue> }
  | Record<string, unknown>;

/** unmarshal が返しうる値の型 */
interface UnmarshaledArray extends Array<UnmarshaledValue> {}
interface UnmarshaledRecord extends Record<string, UnmarshaledValue> {}
type UnmarshaledValue = string | number | boolean | null | UnmarshaledArray | UnmarshaledRecord;

/**
 * DynamoDB マーシャル形式 ({"S": "value"}, {"N": "123"}, {"M": {...}}) を
 * プレーンな JavaScript オブジェクトに変換する
 */
function unmarshal(value: DynamoDBAttributeValue | null | undefined): UnmarshaledValue {
  if (value == null) return null;

  if (typeof value !== "object") return value as UnmarshaledValue;

  // DynamoDB AttributeValue 形式の判定
  if ("S" in value && typeof value.S === "string") return value.S;
  if ("N" in value && typeof value.N === "string") return Number(value.N);
  if ("BOOL" in value && typeof value.BOOL === "boolean") return value.BOOL;
  if ("NULL" in value) return null;
  if ("L" in value && Array.isArray(value.L))
    return (value.L as DynamoDBAttributeValue[]).map(unmarshal);
  if ("M" in value && typeof value.M === "object" && value.M !== null) {
    const result: Record<string, UnmarshaledValue> = {};
    for (const [k, v] of Object.entries(value.M as Record<string, DynamoDBAttributeValue>)) {
      result[k] = unmarshal(v);
    }
    return result;
  }

  // プレーンオブジェクト（マーシャルされていない場合）
  if (typeof value === "object" && !Array.isArray(value)) {
    const keys = Object.keys(value);
    // マーシャル形式でない通常オブジェクトはそのまま返す
    if (keys.length > 0 && !["S", "N", "BOOL", "NULL", "L", "M"].includes(keys[0])) {
      return value as Record<string, UnmarshaledValue>;
    }
  }

  return value as UnmarshaledValue;
}

/**
 * パース済みノードデータの型
 */
interface ParsedNodeData {
  type: string;
  floor: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  entry: { x: number; y: number } | null;
}

function parseNodeItem(item: { PK: string; SK: string; data?: string | null }): Node {
  const nodeId = item.SK.replace("NODE#", "");

  // data は JSON 文字列。中身が DynamoDB マーシャル形式の場合は unmarshal する
  const rawData: unknown = typeof item.data === "string" ? JSON.parse(item.data) : item.data;
  const data = unmarshal({ M: rawData } as DynamoDBAttributeValue) as unknown as ParsedNodeData;

  return {
    id: nodeId,
    type: data.type as NodeType,
    floor: Number(data.floor),
    position: {
      x: Number(data.position.x),
      y: Number(data.position.y),
    },
    size: {
      width: Number(data.size.width),
      height: Number(data.size.height),
    },
    entry: data.entry
      ? {
          x: Number(data.entry.x),
          y: Number(data.entry.y),
        }
      : null,
  };
}

/**
 * DynamoDB (SingleTable) からマップノードデータを取得して Node[] に変換する
 * Amplify Data codegen クライアントを使用
 * @param pk - パーティションキー（デフォルト: "MAP#Umeda"）
 */
export async function fetchMapNodes(pk: string = "MAP#Umeda"): Promise<Node[]> {
  const { data: items, errors } = await client.models.SingleTable.list({
    filter: {
      PK: { eq: pk },
      SK: { beginsWith: "NODE#" },
    },
    limit: 1000,
  });

  if (errors) {
    console.error("Failed to fetch map nodes:", errors);
    return [];
  }

  if (!items || items.length === 0) {
    return [];
  }

  return items
    .filter((item) => item.SK.startsWith("NODE#") && item.data)
    .map((item) => parseNodeItem({ PK: item.PK, SK: item.SK, data: item.data }));
}
