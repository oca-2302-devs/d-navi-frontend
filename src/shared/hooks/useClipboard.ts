import { useState } from "react";

/**
 * クリップボードへのコピー機能を提供するカスタムフック
 * @param resetDelay コピー完了状態をリセットするまでの時間（ミリ秒）
 */
export function useClipboard(resetDelay = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  /**
   * テキストをクリップボードにコピーする
   * @param text コピーするテキスト
   * @returns コピー成功時はtrue、失敗時はfalse
   */
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      // Clipboard APIが利用可能な場合
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback: 古いブラウザ向け
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setIsCopied(true);

      // 指定時間後にコピー状態をリセット
      setTimeout(() => {
        setIsCopied(false);
      }, resetDelay);

      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  };

  return { isCopied, copyToClipboard };
}
