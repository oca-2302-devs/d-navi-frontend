import Link from "next/link";

import { Button } from "@/shared/components/ui/button";

export default function RescanQRButton() {
  return (
    <Button
      asChild
      className="h-[42px] w-full max-w-[265px] rounded-[12px] border-2 border-white bg-rose-500 text-[20px] font-normal text-white hover:bg-rose-500 hover:opacity-90"
    >
      <Link href="/scan/location">QRコード読み直し</Link>
    </Button>
  );
}
