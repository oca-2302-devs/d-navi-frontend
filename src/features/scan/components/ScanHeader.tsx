"use client";

import { ScanningIndicator } from "./ScanningIndicator";

interface ScanHeaderProps {
  isScanning: boolean;
}

export function ScanHeader({ isScanning }: ScanHeaderProps) {
  return (
    <div className="text-center shrink-0 pt-4 sm:pt-0">
      <ScanningIndicator isScanning={isScanning} />
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-rose-900 mb-2 sm:mb-3 tracking-tight">
        QRコードをスキャン
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-rose-600 font-light">
        カメラをQRコードに向けてください
      </p>
    </div>
  );
}
