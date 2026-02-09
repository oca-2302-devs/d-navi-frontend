/**
 * 招待URLを生成する
 * @param roomId ルームID
 * @returns 招待URL（SSR時は空文字列）
 */
export function generateInviteUrl(roomId: string): string {
  // SSR対応: windowオブジェクトが存在しない場合は空文字列を返す
  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.origin}/scan/guest?roomId=${roomId}`;
}
