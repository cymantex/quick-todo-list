import { useEffect } from "react";

export const useKeyboardEvents = (onKeyboardEvent: (key: KeyboardEvent) => void) => {
  useEffect(() => {
    document.addEventListener("keydown", onKeyboardEvent);
    return () => document.removeEventListener("keydown", onKeyboardEvent);
  }, [onKeyboardEvent]);
};
