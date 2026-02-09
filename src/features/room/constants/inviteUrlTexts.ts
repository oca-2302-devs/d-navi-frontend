/**
 * InviteUrlCardで使用するテキスト定数
 */
export const INVITE_URL_TEXTS = {
  title: "招待URL",
  copyButton: "コピー",
  copiedButton: "コピー完了",
  copySuccess: "URLをコピーしました",
  copyError: "コピーに失敗しました",
  shareButton: "共有",
  shareSuccess: "共有しました",
  shareError: "共有に失敗しました",
  description: "このURLをゲストに共有して、ルームに招待できます",
} as const;

/**
 * 共有時のメッセージテンプレート
 */
export const SHARE_MESSAGE_TEMPLATE = (url: string) => `一緒にナビゲーションしましょう！\n${url}`;

/**
 * コピー完了状態をリセットするまでの時間（ミリ秒）
 */
export const COPY_RESET_DELAY = 2000;
