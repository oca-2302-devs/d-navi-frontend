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
        <Button
          asChild
          className="h-[42px] w-full max-w-[265px] rounded-[12px] border-2 border-white bg-[#ff4064] text-[20px] font-normal text-white hover:bg-[#ff4064] hover:opacity-90"
        >
          <Link href="/scan/host">QRコードを読み込む</Link>
        </Button>
      </div>
    </div>
  );
}
