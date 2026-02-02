/**
 * Local Storageからデータを取得。
 * 期限切れの場合は削除してnullを返す。
 *
 * @param key - Local Storageのキー
 * @returns 保存された値またはnull
 */
export function getLocalStorage({ key }: { key: string }): string | null {
  const item = localStorage.getItem(key);
  if (!item) {
    return null;
  }

  try {
    const { value, expiry } = JSON.parse(item);

    if (expiry && Date.now() > expiry) {
      removeLocalStorage(key);
      return null;
    }

    return value;
  } catch {
    removeLocalStorage(key);
    return null;
  }
}

/**
 * Local Storageにデータを保存。
 * オプションで有効期限を設定可能。
 *
 * @param key - Local Storageのキー
 * @param value - 保存する値
 * @param maxAge - 有効期限（ミリ秒単位）
 */
export function saveLocalStorage({
  key,
  value,
  maxAge,
}: {
  key: string;
  value: string;
  maxAge: number;
}) {
  const item = JSON.stringify({
    value,
    expiry: Date.now() + maxAge,
  });

  localStorage.setItem(key, item);
}

/**
 * Local Storageからデータを削除。
 *
 * @param key - Local Storageのキー
 */
export function removeLocalStorage(key: string) {
  localStorage.removeItem(key);
}
