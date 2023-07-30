import { Todo } from "@/todo/TodoStore";
import { useKeyboardShortcuts } from "@/keyboard/useKeyboardShortcuts";
import { useSelectTodoShortcut } from "@/components/TodoList/hooks/useSelectTodoShortcut";
import { useSelectTodoStore } from "@/components/TodoList/hooks/useSelectTodoStore";

export function useSelectTodoShortcuts(todos: Todo[]) {
  const {
    selectedTodoIndexes,
    selectPreviousTodo,
    multiSelectPreviousTodo,
    selectAllTodos,
    multiSelectNextTodo,
    selectNextTodo,
  } = useSelectTodoStore();

  useKeyboardShortcuts(["CtrlA"], () => selectAllTodos(todos));
  useSelectTodoShortcut("ArrowUp", selectedTodoIndexes, todos, (currentIndex) =>
    selectPreviousTodo(todos, currentIndex),
  );
  useSelectTodoShortcut("ArrowDown", selectedTodoIndexes, todos, (currentIndex) =>
    selectNextTodo(todos, currentIndex),
  );
  useSelectTodoShortcut("ShiftArrowUp", selectedTodoIndexes, todos, (currentIndex, lastIndex) =>
    multiSelectPreviousTodo(todos, currentIndex, lastIndex),
  );
  useSelectTodoShortcut("ShiftArrowDown", selectedTodoIndexes, todos, (currentIndex, lastIndex) =>
    multiSelectNextTodo(todos, currentIndex, lastIndex),
  );
}
