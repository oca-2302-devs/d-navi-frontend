"use client";

import { User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";

interface JoinRequestToastProps {
  guestName: string;
  onRequestHandle: (approved: boolean) => void;
  id: string | number; // To dismiss the toast
}

export const JoinRequestToast = ({ guestName, onRequestHandle, id }: JoinRequestToastProps) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <User className="size-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{guestName}</span>
          <span className="text-xs text-muted-foreground">参加リクエストが届きました</span>
        </div>
      </div>
      <div className="flex gap-2 w-full">
        <Button
          size="sm"
          variant="default"
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold"
          onClick={() => {
            onRequestHandle(true);
            toast.dismiss(id);
          }}
        >
          承認
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => {
            onRequestHandle(false);
            toast.dismiss(id);
          }}
        >
          拒否
        </Button>
      </div>
    </div>
  );
};
