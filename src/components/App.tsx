import { todoStore } from "@/todo/TodoStore";
import { useKeyboardShortcuts } from "@/keyboard/useKeyboardShortcuts";
import { TodoList } from "@/components/TodoList/TodoList";
import { useSelectTodoStore } from "@/components/TodoList/hooks/useSelectTodoStore";
import _ from "lodash";

function App() {
  // TODO: Separate state for marked and selected todo

  // Drag and drop?
  // Ctrl + left/right -> promote/denote todo
  // Ctrl + up/down -> move todo
  // Ctrl + N -> new Todo
  // Ctrl + Shift + N -> new sub todo
  // Ctrl + d -> duplicate
  const { selectedTodoIds, selectTodo, unselectAllTodos } = useSelectTodoStore();

  function selectLastTodoOrUnselect() {
    const lastTodo = _.last(todoStore.getTodos());

    if (lastTodo) {
      selectTodo(lastTodo);
    } else {
      unselectAllTodos();
    }
  }

  useKeyboardShortcuts(["CtrlArrowUp"], () => todoStore.moveUp(selectedTodoIds));
  useKeyboardShortcuts(["CtrlArrowDown"], () => todoStore.moveDown(selectedTodoIds));
  useKeyboardShortcuts(["CtrlD"], () => {
    todoStore.duplicate(selectedTodoIds);
    selectLastTodoOrUnselect();
  });
  useKeyboardShortcuts(["Delete"], () => {
    todoStore.deleteTodos(selectedTodoIds);
    selectLastTodoOrUnselect();
  });
  useKeyboardShortcuts(["CtrlN"], () => selectTodo(todoStore.addTodo({ text: "" })));
  useKeyboardShortcuts(["CtrlShiftN"], () => selectTodo(todoStore.addTodo({ text: "" })));
  useKeyboardShortcuts(["CtrlZ"], () => todoStore.undo());

  // TODO: Refactor selecting todos

  return (
    <TodoList
      onTodoTextChange={(todo, text) =>
        todoStore.updateTodo({
          ...todo,
          text,
        })
      }
    />
  );
}

export default App;
