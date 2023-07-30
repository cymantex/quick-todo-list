import { useKeyboardEvents } from "@/keyboard/useKeyboardEvents";

const shortcuts = [
  "Delete",
  "CtrlArrowLeft",
  "CtrlArrowRight",
  "CtrlArrowUp",
  "CtrlArrowDown",
  "CtrlShiftN",
  "CtrlN",
  "CtrlA",
  "CtrlZ",
  "CtrlShiftZ",
  "CtrlD",
  "ArrowUp",
  "ArrowDown",
  "ShiftArrowUp",
  "ShiftArrowDown",
] as const;

export type Shortcut = (typeof shortcuts)[number];

export const useKeyboardShortcuts = (shortcuts: Shortcut[], callback: () => void) => {
  useKeyboardEvents((event) =>
    shortcuts
      .map(toKeyboardShortcut)
      .filter((shortcut) => isShortcut(event, shortcut))
      .forEach(() => {
        event.preventDefault();
        callback();
      }),
  );
};

function isShortcut(
  event: KeyboardEvent,
  shortcut: Pick<KeyboardEvent, "key" | "ctrlKey" | "shiftKey">,
) {
  return (
    event.key.toLowerCase() === shortcut.key.toLowerCase() &&
    event.ctrlKey === shortcut.ctrlKey &&
    event.shiftKey === shortcut.shiftKey
  );
}

const toKeyboardShortcut = (shortcut: Shortcut) => {
  switch (shortcut) {
    case "Delete":
      return {
        key: "Delete",
        ctrlKey: false,
        shiftKey: false,
      };
    case "CtrlArrowLeft":
      return {
        key: "ArrowLeft",
        ctrlKey: true,
        shiftKey: false,
      };
    case "CtrlArrowRight":
      return {
        key: "ArrowRight",
        ctrlKey: true,
        shiftKey: false,
      };
    case "CtrlArrowUp":
      return {
        key: "ArrowUp",
        ctrlKey: true,
        shiftKey: false,
      };
    case "CtrlArrowDown":
      return {
        key: "ArrowDown",
        ctrlKey: true,
        shiftKey: false,
      };
    case "CtrlShiftN":
      return {
        key: "n",
        ctrlKey: true,
        shiftKey: true,
      };
    case "CtrlN":
      return {
        key: "n",
        ctrlKey: true,
        shiftKey: false,
      };
    case "CtrlA":
      return {
        key: "a",
        ctrlKey: true,
        shiftKey: false,
      };
    case "CtrlZ":
      return {
        key: "z",
        ctrlKey: true,
        shiftKey: false,
      };
    case "CtrlShiftZ":
      return {
        key: "z",
        ctrlKey: true,
        shiftKey: true,
      };
    case "CtrlD":
      return {
        key: "d",
        ctrlKey: true,
        shiftKey: false,
      };
    case "ShiftArrowUp":
      return {
        key: "ArrowUp",
        ctrlKey: false,
        shiftKey: true,
      };
    case "ShiftArrowDown":
      return {
        key: "ArrowDown",
        ctrlKey: false,
        shiftKey: true,
      };
    case "ArrowUp":
      return {
        key: "ArrowUp",
        ctrlKey: false,
        shiftKey: false,
      };
    case "ArrowDown":
      return {
        key: "ArrowDown",
        ctrlKey: false,
        shiftKey: false,
      };
    default:
      throw new Error(`Unknown shortcut: ${shortcut}`);
  }
};
