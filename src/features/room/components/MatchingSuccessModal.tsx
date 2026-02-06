"use client";

import { ONE_SECOND_MS } from "@/shared/constants/time";
import { useAutoClose } from "@/shared/hooks";

import { BaseStatusModal } from "./BaseStatusModal";

type MatchingSuccessModalProps = {
  open: boolean;
  onClose: () => void;
};

const AUTO_CLOSE_DELAY_MS = 3 * ONE_SECOND_MS;

export function MatchingSuccessModal({ open, onClose }: MatchingSuccessModalProps) {
  useAutoClose(open, onClose, AUTO_CLOSE_DELAY_MS);

  return (
    <BaseStatusModal
      open={open}
      onClose={onClose}
      title="マッチングが成立しました！"
      footer={<p className="text-base text-black font-normal">最適な目的地・経路を考え中です...</p>}
    />
  );
}
