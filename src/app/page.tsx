import Image from "next/image";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";

import landingImage from "../assets/landing-image.png";

export default function Home() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-[#ff4064] p-4">
      {/* Main Container */}
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        {/* Card/Image Container */}
        <div className="relative aspect-square w-64 overflow-hidden">
          <Image src={landingImage} alt="Dナビ" fill className="object-cover" priority />
        </div>

        {/* Action Button */}
        {/* Action Buttons */}
        <div className="flex w-full flex-col items-center gap-12">
          {/* Get Current Location Button */}
          <Button
            asChild
            className="h-10.5 w-full max-w-66.25 rounded-2xl border-2 border-white bg-[#ff4064] text-[20px] font-normal text-white hover:bg-[#ff4064] hover:opacity-90"
          >
            <Link href="/scan/location">現在地取得</Link>
          </Button>

          {/* Create Room Button */}
          <Button
            asChild
            className="h-10.5 w-full max-w-66.25 rounded-2xl border-2 border-white bg-[#ff4064] text-[20px] font-normal text-white hover:bg-[#ff4064] hover:opacity-90"
          >
            <Link href="/scan/host">room作成</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
