"use client";

import { toast } from "sonner";

import { JoinRequestToast } from "@/features/map/components/JoinRequestToast";

import { Button } from "@/shared/components/ui/button";

export default function DebugJoinRequestPage() {
  const handleJoinRequest = () => {
    toast.custom(
      (id) => (
        <JoinRequestToast
          id={id}
          guestName="山田 太郎"
          onRequestHandle={(approved) => {
            console.log(approved ? "Approved" : "Rejected");
            toast.message(approved ? "承認しました" : "拒否しました");
          }}
        />
      ),
      {
        duration: Infinity, // Keep it open until interaction
        position: "top-center",
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Join Request Debug</h1>
      <Button onClick={handleJoinRequest}>Simulate Join Request</Button>
    </div>
  );
}
