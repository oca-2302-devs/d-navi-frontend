import { useEffect } from "react";

import { ONE_SECOND_MS } from "@/shared/constants/time";

export function useAutoClose(
  isOpen: boolean,
  onClose: () => void,
  delayMs: number = 3 * ONE_SECOND_MS
) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, delayMs);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, delayMs]);
}
