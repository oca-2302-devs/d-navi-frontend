import { useCallback, useEffect, useRef, useState } from "react";

/**
 * クリップボードへのコピー機能を提供するカスタムフック
 * @param resetDelay コピー完了状態をリセットするまでの時間（ミリ秒）
 */
export function useClipboard(resetDelay = 2000) {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // アンマウント時にタイマーをクリーンアップ
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  /**
   * テキストをクリップボードにコピーする
   * @param text コピーするテキスト
   * @returns コピー成功時はtrue、失敗時はfalse
   */
  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text);

        setIsCopied(true);

        // 前回のタイマーがあればクリア
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        // 指定時間後にコピー状態をリセット
        timerRef.current = setTimeout(() => {
          setIsCopied(false);
          timerRef.current = null;
        }, resetDelay);

        return true;
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        return false;
      }
    },
    [resetDelay]
  );

  return { isCopied, copyToClipboard };
}
