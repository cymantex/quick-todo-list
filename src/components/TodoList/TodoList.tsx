import { TodoInput } from "@/components/TodoList/components/TodoInput";
import { Todo } from "@/todo/TodoStore";
import { useTodos } from "@/todo/useTodos";
import { useSelectTodoShortcuts } from "@/components/TodoList/hooks/useSelectTodoShortcuts";
import { useSelectTodoStore } from "@/components/TodoList/hooks/useSelectTodoStore";

interface TodoListProps {
  onTodoTextChange: (todo: Todo, text: string) => void;
}

export const TodoList = ({ onTodoTextChange }: TodoListProps) => {
  const todos = useTodos();
  const { markedTodo, selectedTodoIds, selectTodo } = useSelectTodoStore();

  useSelectTodoShortcuts(todos);

  return (
    <>
      {todos.map((todo) => (
        <TodoInput
          key={todo.sortIndex}
          todo={todo}
          marked={markedTodo?.id === todo.id}
          selected={selectedTodoIds.includes(todo.id)}
          onClick={() => selectTodo(todo)}
          onBlur={() => {}}
          onChange={(event) => onTodoTextChange(todo, event.target.value)}
        />
      ))}
    </>
  );
};
