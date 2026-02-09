import type { Metadata } from "next";
import Link from "next/link";

import { Map } from "@/features/map/components";
import { RescanQRButton } from "@/features/scan/components";

import { Button } from "@/shared/components/ui/button";

export const metadata: Metadata = {
  title: "現在地マップ",
};

export default function MapPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#ff4064] p-4">
      {/* Main Container */}
      <div className="flex w-full max-w-4xl flex-col items-center gap-8">
        {/* Map Container */}
        <div className="w-full rounded-lg bg-white p-4 shadow-lg">
          <Map showRoute={false} showCurrentLocation={true} />
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col items-center gap-4">
          {/* Create Room Button */}
          <Button
            asChild
            className="h-[42px] w-full max-w-[265px] rounded-[12px] border-2 border-white bg-[#ff4064] text-[20px] font-normal text-white hover:bg-[#ff4064] hover:opacity-90"
          >
            <Link href="/scan/host">room作成</Link>
          </Button>

          {/* Rescan QR Button */}
          <RescanQRButton />
        </div>
      </div>
    </div>
  );
}
