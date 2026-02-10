import { EdgeData } from "@/features/map/types";

import { ONE_HOUR_MS } from "@/shared/constants";

import { STORAGE_KEYS } from "./key";
import { getLocalStorage, saveLocalStorage } from "./localStorage";

/**
 * ルートデータ（EdgeData）を localStorage に保存する
 */
export function saveRouteData(data: EdgeData): void {
  saveLocalStorage({
    key: STORAGE_KEYS.ROUTE.DATA,
    value: JSON.stringify(data),
    maxAge: ONE_HOUR_MS,
  });
}

/**
 * ルートデータ（EdgeData）を localStorage から取得する
 */
export function getRouteData(): EdgeData | null {
  const raw = getLocalStorage({ key: STORAGE_KEYS.ROUTE.DATA });
  if (!raw) return null;

  try {
    return JSON.parse(raw) as EdgeData;
  } catch {
    return null;
  }
}
