"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface ScanningIndicatorProps {
  isScanning: boolean;
}

export default function ScanningIndicator({ isScanning }: ScanningIndicatorProps) {
  return (
    <motion.div
      animate={{ rotate: isScanning ? 360 : 0 }}
      transition={{ duration: 2, repeat: isScanning ? Infinity : 0 }}
      className="flex justify-center mb-3 sm:mb-4"
    >
      <div className="p-2.5 sm:p-3 md:p-4 bg-rose-500 rounded-lg sm:rounded-xl md:rounded-2xl">
        <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
      </div>
    </motion.div>
  );
}
