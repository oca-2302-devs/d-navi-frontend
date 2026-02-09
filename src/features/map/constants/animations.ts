import { Variants } from "framer-motion";

/**
 * エッジパスを描画するためのアニメーションバリアント
 */
export const edgeDrawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring" as const, duration: 1.5, bounce: 0 },
      opacity: { duration: 0.01 },
    },
  },
};
