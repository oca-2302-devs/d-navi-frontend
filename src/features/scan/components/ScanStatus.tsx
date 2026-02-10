"use client";

import { motion } from "framer-motion";

interface ScanStatusProps {
  isScanning: boolean;
}

export function ScanStatus({ isScanning }: ScanStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="p-3 sm:p-4 md:p-5 bg-white/70 rounded-xl sm:rounded-2xl border border-rose-400/50 backdrop-blur-sm shrink-0 mb-4 sm:mb-0"
    >
      <p className="text-sm sm:text-base md:text-lg text-rose-700 text-center font-medium">
        {isScanning ? (
          <span className="text-rose-500">スキャン中...</span>
        ) : (
          <span className="text-green-500">スキャン完了！</span>
        )}
      </p>
    </motion.div>
  );
}
