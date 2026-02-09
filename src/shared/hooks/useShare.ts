/**
 * 共有結果の型定義
 */
export type ShareResult = {
  success: boolean;
  cancelled?: boolean;
  error?: unknown;
};

/**
 * Web Share APIまたはLINE共有機能を提供するカスタムフック
 */
export function useShare() {
  /**
   * テキストを共有する
   * @param text 共有するテキスト
   * @param title 共有タイトル（オプション）
   * @returns 共有結果
   */
  const share = async (text: string, title?: string): Promise<ShareResult> => {
    try {
      // Web Share APIが利用可能な場合
      if (navigator.share) {
        await navigator.share({
          title,
          text,
        });
        return { success: true };
      } else {
        // Fallback: LINE共有
        const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
        window.open(lineUrl, "_blank");
        return { success: true };
      }
    } catch (error) {
      // ユーザーがキャンセルした場合
      if ((error as Error).name === "AbortError") {
        return { success: false, cancelled: true };
      }

      console.error("Failed to share:", error);
      return { success: false, error };
    }
  };

  return { share };
}
