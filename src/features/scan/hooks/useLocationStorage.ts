import { ONE_HOUR_MS } from "@/shared/constants";
import { saveLocalStorage, STORAGE_KEYS } from "@/shared/lib/storage";

export interface LocationData {
  floor: number;
  x: number;
  y: number;
}

export interface UseLocationStorageReturn {
  saveLocation: (location: LocationData) => void;
}

/**
 * 位置情報をLocalStorageに保存するフック
 * スキャン機能から位置情報保存の責務を分離
 */
export function useLocationStorage(): UseLocationStorageReturn {
  const saveLocation = (location: LocationData): void => {
    const locationString = JSON.stringify(location);

    saveLocalStorage({
      key: STORAGE_KEYS.LOCATION.CURRENT,
      value: locationString,
      maxAge: ONE_HOUR_MS,
    });
  };

  return { saveLocation };
}
