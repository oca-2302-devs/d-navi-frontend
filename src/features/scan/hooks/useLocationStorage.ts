import { ONE_HOUR_MS } from "@/shared/constants";
import { saveLocalStorage, STORAGE_KEYS } from "@/shared/lib/storage";

export interface UseLocationStorageReturn {
  saveLocation: (value: string) => void;
}

/**
 * 位置情報をLocalStorageに保存するフック
 * スキャン機能から位置情報保存の責務を分離
 */
export function useLocationStorage(): UseLocationStorageReturn {
  const saveLocation = (value: string): void => {
    saveLocalStorage({
      key: STORAGE_KEYS.LOCATION.CURRENT,
      value: value,
      maxAge: ONE_HOUR_MS,
    });
  };

  return { saveLocation };
}
