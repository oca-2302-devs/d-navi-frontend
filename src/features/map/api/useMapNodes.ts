"use client";

import { useQuery } from "@tanstack/react-query";

import { Node } from "../types";

import { fetchMapNodes } from "./fetchMapNodes";

/**
 * DynamoDB からマップノードデータを取得する React Query フック
 * @param pk - パーティションキー（デフォルト: "MAP#Umeda"）
 */
export function useMapNodes(pk: string = "MAP#Umeda") {
  return useQuery<Node[]>({
    queryKey: ["mapNodes", pk],
    queryFn: () => fetchMapNodes(pk),
    staleTime: 5 * 60 * 1000, // 5分間はキャッシュを使用
  });
}
