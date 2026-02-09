"use client";

import { Copy, Check, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { useClipboard, useMounted, useShare } from "@/shared/hooks";

import {
  INVITE_URL_TEXTS,
  SHARE_MESSAGE_TEMPLATE,
  COPY_RESET_DELAY,
} from "../constants/inviteUrlTexts";
import { generateInviteUrl } from "../lib/inviteUrlUtils";

export function InviteUrlCard() {
  const params = useParams<{ room_id: string }>();
  const mounted = useMounted();
  const { isCopied, copyToClipboard } = useClipboard(COPY_RESET_DELAY);
  const { share } = useShare();

  const inviteUrl = mounted ? generateInviteUrl(params.room_id) : "";

  const handleCopy = async () => {
    const success = await copyToClipboard(inviteUrl);
    if (success) {
      toast.success(INVITE_URL_TEXTS.copySuccess);
    } else {
      toast.error(INVITE_URL_TEXTS.copyError);
    }
  };

  const handleShare = async () => {
    const shareText = SHARE_MESSAGE_TEMPLATE(inviteUrl);
    const result = await share(shareText, INVITE_URL_TEXTS.title);

    if (result.success) {
      toast.success(INVITE_URL_TEXTS.shareSuccess);
    } else if (!result.cancelled) {
      toast.error(INVITE_URL_TEXTS.shareError);
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
                {INVITE_URL_TEXTS.copiedButton}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                {INVITE_URL_TEXTS.copyButton}
              </>
            )}
          </Button>

          <Button
            size="default"
            variant="default"
            onClick={handleShare}
            className="flex items-center justify-center w-9 h-9 p-0 bg-gray-500 hover:bg-gray-600"
            aria-label={INVITE_URL_TEXTS.shareButton}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-xs text-gray-500">{INVITE_URL_TEXTS.description}</p>
      </div>
    </div>
  );
}
