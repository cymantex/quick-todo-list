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
  const { markedTodo, selectedTodoIndexes, selectTodo } = useSelectTodoStore();

  useSelectTodoShortcuts(todos);

  return (
    <>
      {todos.map((todo) => (
        <TodoInput
          key={todo.index}
          todo={todo}
          marked={markedTodo?.index === todo.index}
          selected={selectedTodoIndexes.includes(todo.index)}
          onClick={() => selectTodo(todo)}
          onBlur={() => {}}
          onChange={(event) => onTodoTextChange(todo, event.target.value)}
        />
      ))}
    </>
  );
};
