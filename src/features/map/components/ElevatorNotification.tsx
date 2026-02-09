"use client";

import { AnimatePresence, motion } from "framer-motion";

interface ElevatorNotificationProps {
  nextFloor: number | null;
}

export function ElevatorNotification({ nextFloor }: ElevatorNotificationProps) {
  return (
    <AnimatePresence>
      {nextFloor && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-xl flex items-center gap-3 border-2 border-white/20 backdrop-blur-md">
            <div className="bg-white/20 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
                <path d="M12 10V4" />
                <polyline points="8 6 12 4 16 6" />
                <path d="M12 20v-6" />
                <polyline points="16 18 12 20 8 18" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-rose-100 uppercase tracking-wider">
                Next Step
              </span>
              <span className="text-xl font-bold">
                エレベーターで <span className="text-3xl filter drop-shadow-md">{nextFloor}F</span>{" "}
                へ
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
