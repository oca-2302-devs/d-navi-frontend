"use client";

import { ReactNode } from "react";
import { createPortal } from "react-dom";

import { AnimatePresence, motion } from "framer-motion";

import { useMounted } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";

interface BaseStatusModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string; // Allow extending content styling if needed
}

export function BaseStatusModal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: BaseStatusModalProps) {
  const mounted = useMounted();

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
              className={cn("p-8 flex flex-col items-center text-center", className)}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-rose-500 drop-shadow-sm">{title}</h2>
              {children}
            </motion.div>
          </div>

          {/* Bottom Footer Area */}
          {footer && <div className="pb-16 text-center">{footer}</div>}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
