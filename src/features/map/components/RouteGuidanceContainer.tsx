"use client";

import { Map } from "@/features/map/components/Map";
import RescanQRButton from "@/features/scan/components/RescanQRButton";

export default function RouteGuidanceContainer() {
  return (
    <div className="flex flex-col justify-center items-center gap-12">
      <Map />
      <RescanQRButton />
    </div>
  );
}
