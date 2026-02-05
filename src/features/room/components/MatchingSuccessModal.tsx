"use client";

import { createPortal } from "react-dom";

import { AnimatePresence, motion } from "framer-motion";

import { ONE_SECOND_MS } from "@/shared/constants/time";
import { useAutoClose, useMounted } from "@/shared/hooks";

type MatchingSuccessModalProps = {
  open: boolean;
  onClose: () => void;
};

const AUTO_CLOSE_DELAY_MS = 3 * ONE_SECOND_MS;

export function MatchingSuccessModal({ open, onClose }: MatchingSuccessModalProps) {
  const mounted = useMounted();
  useAutoClose(open, onClose, AUTO_CLOSE_DELAY_MS);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-overlay"
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-white/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex-1 flex items-center justify-center w-full">
            <motion.div
              key="modal-content"
              className="p-8 flex flex-col items-center text-center"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-rose-500 drop-shadow-sm">
                マッチングが成立しました！
              </h2>
            </motion.div>
          </div>

          {/* Bottom Text */}
          <div className="pb-16 text-center">
            <p className="text-base text-black font-normal">最適な目的地・経路を考え中です...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
