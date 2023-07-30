import { useSyncExternalStore } from "react";
import { todoStore } from "@/todo/TodoStore";

export const useTodos = () => {
  return useSyncExternalStore(todoStore.subscribe, todoStore.getTodos);
};
