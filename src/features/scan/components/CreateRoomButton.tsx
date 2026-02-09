"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";

export default function CreateRoomButton() {
  const router = useRouter();

  const handleCreateRoom = () => {
    // UUID v4を生成
    const roomId = crypto.randomUUID();
    router.push(`/room/${roomId}/map`);
  };

  return (
    <Button
      onClick={handleCreateRoom}
      className="h-[42px] w-full max-w-[265px] rounded-[12px] border-2 border-white bg-rose-500 text-[20px] font-normal text-white hover:bg-rose-500 hover:opacity-90"
    >
      ルーム作成
    </Button>
  );
}
