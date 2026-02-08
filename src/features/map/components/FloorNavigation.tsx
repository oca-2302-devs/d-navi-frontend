"use client";

import * as React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Layers } from "lucide-react";

import { FLOOR_NUMBERS } from "@/shared/constants/floors";
import { cn } from "@/shared/lib/utils";

interface FloorNavigationProps {
  currentLevel: number;
  onLevelChange: (level: number) => void;
  className?: string;
}

// Variants for the container expansion
const containerVariants = {
  closed: {
    height: "auto",
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

// Variants for individual buttons
const itemVariants = {
  closed: { opacity: 0, scale: 0.3, y: 20 },
  open: { opacity: 1, scale: 1, y: 0 },
};

export function FloorNavigation({ currentLevel, onLevelChange, className }: FloorNavigationProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Floors 6 to 1 (descending for visual stack)
  const floors = FLOOR_NUMBERS;

  function toggleOpen() {
    setIsOpen((prev) => !prev);
  }

  return (
    <div className={cn("fixed bottom-4 left-4 z-50 flex flex-col items-center gap-2", className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={containerVariants}
            className="flex flex-col gap-3 mb-2"
          >
            {floors.map((floor) => (
              <motion.button
                key={floor}
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onLevelChange(floor);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full text-lg font-medium transition-colors shadow-lg backdrop-blur-sm",
                  currentLevel === floor
                    ? "bg-rose-500 text-white shadow-rose-500/30"
                    : "bg-white/80 text-gray-600 hover:bg-white hover:text-rose-500 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:text-rose-400"
                )}
              >
                {floor}F
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "flex items-center justify-center w-14 h-14 rounded-full shadow-xl z-10 transition-colors",
          isOpen
            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
            : "bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
        )}
      >
        {isOpen ? (
          <Layers className="w-6 h-6 rotate-180" />
        ) : (
          <span className="text-xl font-bold font-sans">{currentLevel}F</span>
        )}
      </motion.button>
    </div>
  );
}
