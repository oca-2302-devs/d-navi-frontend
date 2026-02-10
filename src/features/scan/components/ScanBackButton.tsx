"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function ScanBackButton() {
  const router = useRouter();

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => router.back()}
      className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/50 hover:bg-white/70 border border-rose-400/50 backdrop-blur-sm transition-colors duration-200 group"
    >
      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600 group-hover:text-rose-700 transition-colors" />
    </motion.button>
  );
}
