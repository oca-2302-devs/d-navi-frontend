"use client";

import { useParams } from "next/navigation";

import { useClipboard, useMounted, useShare } from "@/shared/hooks";

import {
  INVITE_URL_TEXTS,
  SHARE_MESSAGE_TEMPLATE,
  COPY_RESET_DELAY,
} from "../constants/inviteUrlTexts";
import { generateInviteUrl } from "../lib/inviteUrlUtils";

export interface UseInviteUrlReturn {
  inviteUrl: string;
  isCopied: boolean;
  handleCopy: () => Promise<void>;
  handleShare: () => Promise<void>;
}

/**
 * 招待URL機能のロジックを提供するフック
 * URL生成、コピー、共有機能を管理
 */
export function useInviteUrl(): UseInviteUrlReturn {
  const params = useParams<{ room_id: string }>();
  const mounted = useMounted();
  const { isCopied, copyToClipboard } = useClipboard(COPY_RESET_DELAY);
  const { share } = useShare();

  const inviteUrl = mounted ? generateInviteUrl(params.room_id) : "";

  const handleCopy = async (): Promise<void> => {
    await copyToClipboard(inviteUrl);
  };

  const handleShare = async (): Promise<void> => {
    const shareText = SHARE_MESSAGE_TEMPLATE(inviteUrl);
    await share(shareText, INVITE_URL_TEXTS.title);
  };

  return {
    inviteUrl,
    isCopied,
    handleCopy,
    handleShare,
  };
}
