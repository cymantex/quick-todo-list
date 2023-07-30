import { Shortcut, useKeyboardShortcuts } from "@/keyboard/useKeyboardShortcuts";
import { Todo } from "@/todo/TodoStore";
import _ from "lodash";

export function useSelectTodoShortcut(
  shortcut: Shortcut,
  selectedTodoIds: string[],
  todos: Todo[],
  selectNextTodo: (todo: Todo) => void,
) {
  useKeyboardShortcuts([shortcut], () => {
    if (selectedTodoIds.length === 0) {
      return;
    }

    const currentId = _.last(selectedTodoIds)!;
    const currentTodo = todos.find((todo) => todo.id === currentId)!;
    selectNextTodo(currentTodo);
  });
}
