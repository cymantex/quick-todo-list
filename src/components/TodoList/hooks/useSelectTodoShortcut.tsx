import { Shortcut, useKeyboardShortcuts } from "@/keyboard/useKeyboardShortcuts";
import { Todo } from "@/todo/TodoStore";
import _ from "lodash";

export function useSelectTodoShortcut(
  shortcut: Shortcut,
  selectedTodoIndexes: number[],
  todos: Todo[],
  selectNextTodo: (currentIndex: number, lastIndex: number) => void,
) {
  useKeyboardShortcuts([shortcut], () => {
    if (selectedTodoIndexes.length === 0) {
      return;
    }

    const lastIndex = _.last(selectedTodoIndexes)!;
    const currentIndex = todos.findIndex((todo) => todo.index === lastIndex);
    selectNextTodo(currentIndex, lastIndex);
  });
}
