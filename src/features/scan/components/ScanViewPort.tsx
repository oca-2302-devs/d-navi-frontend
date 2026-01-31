"use client";

import { Scanner } from "@yudiel/react-qr-scanner";
import { motion } from "framer-motion";

import { HandleError, HandleScan } from "../hooks/useScanner";

interface ScanViewPortProps {
  handleScan: HandleScan;
  handleError: HandleError;
}

export default function ScanViewPort({ handleScan, handleError }: ScanViewPortProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative flex-1 sm:flex-none w-full max-h-[65vh] sm:max-h-[60vh] md:max-h-none sm:aspect-square overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-rose-400/50 backdrop-blur"
    >
      <div className="relative z-10 w-full h-full overflow-hidden rounded-2xl sm:rounded-3xl bg-rose-50">
        <Scanner
          onScan={handleScan}
          onError={handleError}
          components={{
            finder: true,
          }}
          styles={{
            container: {
              width: "100%",
              height: "100%",
            },
          }}
        />
      </div>
    </motion.div>
  );
}
