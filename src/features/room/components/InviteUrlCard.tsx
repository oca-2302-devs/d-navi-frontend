"use client";

import { useState } from "react";

import { Copy, Check, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { useMounted } from "@/shared/hooks";

const TEXTS = {
  title: "招待URL",
  copyButton: "コピー",
  copiedButton: "コピー完了",
  copySuccess: "URLをコピーしました",
  copyError: "コピーに失敗しました",
  shareButton: "共有",
  shareSuccess: "共有しました",
  shareError: "共有に失敗しました",
} as const;

export function InviteUrlCard() {
  const params = useParams<{ roomId: string }>();
  const mounted = useMounted();
  const [isCopied, setIsCopied] = useState(false);

  // SSR対応: window.location.originはクライアントサイドでのみ利用可能
  const inviteUrl = mounted ? `${window.location.origin}/scan/guest?roomId=${params.roomId}` : "";

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(inviteUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = inviteUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setIsCopied(true);
      toast.success(TEXTS.copySuccess);

      // 2秒後にコピー状態をリセット
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      toast.error(TEXTS.copyError);
      console.error("Failed to copy URL:", error);
    }
  };

  const handleShare = async () => {
    const shareText = `一緒にナビゲーションしましょう！\n${inviteUrl}`;

    try {
      // Web Share APIが利用可能な場合
      if (navigator.share) {
        await navigator.share({
          title: "招待URL",
          text: shareText,
        });
        toast.success(TEXTS.shareSuccess);
      } else {
        // Web Share APIが利用できない場合はLINEに直接共有
        const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`;
        window.open(lineUrl, "_blank");
      }
    } catch (error) {
      // ユーザーがキャンセルした場合はエラーを表示しない
      if ((error as Error).name !== "AbortError") {
        toast.error(TEXTS.shareError);
        console.error("Failed to share URL:", error);
      }
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={inviteUrl}
            readOnly
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onClick={(e) => e.currentTarget.select()}
          />

          <Button
            size="default"
            variant="default"
            onClick={handleCopy}
            className="flex items-center gap-2 whitespace-nowrap bg-rose-500 hover:bg-rose-600"
            disabled={isCopied}
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4" />
                {TEXTS.copiedButton}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                {TEXTS.copyButton}
              </>
            )}
          </Button>

          <Button
            size="default"
            variant="default"
            onClick={handleShare}
            className="flex items-center justify-center w-9 h-9 p-0 bg-gray-500 hover:bg-gray-600"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-xs text-gray-500">このURLをゲストに共有して、ルームに招待できます</p>
      </div>
    </div>
  );
}
