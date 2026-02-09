"use client";

import { Spinner } from "@/shared/components/ui/spinner";
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
      footer={
        <div className="flex items-center gap-2 text-base text-black font-normal">
          <Spinner className="size-5" />
          <p>最適な目的地・経路を考え中です...</p>
        </div>
      }
    />
  );
}
