"use client";

import { motion } from "framer-motion";

import ScanBackButton from "@/features/scan/components/ScanBackButton";
import ScanHeader from "@/features/scan/components/ScanHeader";
import ScanStatus from "@/features/scan/components/ScanStatus";
import ScanViewPort from "@/features/scan/components/ScanViewPort";

import { HandleError, HandleScan } from "../hooks/useScanner";

interface ScanLayoutProps {
  isScanning: boolean;
  handleScan: HandleScan;
  handleError: HandleError;
}

export default function ScanLayout({ isScanning, handleScan, handleError }: ScanLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-rose-300 flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
      <ScanBackButton />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl flex flex-col gap-4 sm:gap-6 md:gap-8 h-screen sm:h-auto"
      >
        <ScanHeader isScanning={isScanning} />
        <ScanViewPort handleScan={handleScan} handleError={handleError} />
        <ScanStatus isScanning={isScanning} />
      </motion.div>
    </div>
  );
}
