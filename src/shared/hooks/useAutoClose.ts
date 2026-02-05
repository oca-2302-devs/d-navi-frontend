import { useEffect } from "react";

export function useAutoClose(isOpen: boolean, onClose: () => void, delayMs: number = 3000) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, delayMs);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, delayMs]);
}
