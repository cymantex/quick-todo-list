import { Todo } from "@/todo/TodoStore";
import { useKeyboardShortcuts } from "@/keyboard/useKeyboardShortcuts";
import { useSelectTodoShortcut } from "@/components/TodoList/hooks/useSelectTodoShortcut";
import { useSelectTodoStore } from "@/components/TodoList/hooks/useSelectTodoStore";

export function useSelectTodoShortcuts(todos: Todo[]) {
  const {
    selectedTodoIds,
    selectPreviousTodo,
    multiSelectPreviousTodo,
    selectAllTodos,
    multiSelectNextTodo,
    selectNextTodo,
  } = useSelectTodoStore();

  useKeyboardShortcuts(["CtrlA"], () => selectAllTodos(todos));
  useSelectTodoShortcut("ArrowUp", selectedTodoIds, todos, (todo) =>
    selectPreviousTodo(todos, todo),
  );
  useSelectTodoShortcut("ArrowDown", selectedTodoIds, todos, (todo) => selectNextTodo(todos, todo));
  useSelectTodoShortcut("ShiftArrowUp", selectedTodoIds, todos, (todo) =>
    multiSelectPreviousTodo(todos, todo),
  );
  useSelectTodoShortcut("ShiftArrowDown", selectedTodoIds, todos, (todo) =>
    multiSelectNextTodo(todos, todo),
  );
}
