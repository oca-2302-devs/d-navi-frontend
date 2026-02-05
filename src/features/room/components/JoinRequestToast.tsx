import { useState } from "react";

import { User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";

const TEXTS = {
  title: "参加リクエスト",
  description: "新しい参加リクエストが届きました",
  approve: "承認",
  reject: "拒否",
};

export interface JoinRequestToastProps {
  onRequestHandle: (approved: boolean) => Promise<void> | void;
  id: string | number; // To dismiss the toast
}

export const JoinRequestToast = ({ onRequestHandle, id }: JoinRequestToastProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async (approved: boolean) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onRequestHandle(approved);
      toast.dismiss(id);
    } catch (error) {
      console.error("Failed to handle join request", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <User className="size-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{TEXTS.title}</span>
          <span className="text-xs text-muted-foreground">{TEXTS.description}</span>
        </div>
      </div>
      <div className="flex gap-2 w-full">
        <Button
          size="sm"
          variant="default"
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold"
          disabled={isSubmitting}
          onClick={() => handleAction(true)}
        >
          {TEXTS.approve}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          disabled={isSubmitting}
          onClick={() => handleAction(false)}
        >
          {TEXTS.reject}
        </Button>
      </div>
    </div>
  );
};
