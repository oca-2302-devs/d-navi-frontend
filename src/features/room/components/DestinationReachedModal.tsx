"use client";

import { Button } from "@/shared/components/ui/button";

import { BaseStatusModal } from "./BaseStatusModal";

type DestinationReachedModalProps = {
  open: boolean;
  onClose: () => void;
};

export function DestinationReachedModal({ open, onClose }: DestinationReachedModalProps) {
  return (
    <BaseStatusModal
      open={open}
      onClose={onClose}
      title="目的地に到着しました！"
      footer={
        <Button onClick={onClose} className="rounded-full px-8 py-6 text-lg font-bold shadow-lg">
          閉じる
        </Button>
      }
    />
  );
}
