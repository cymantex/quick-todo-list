import { create } from "zustand";
import { Todo } from "@/todo/TodoStore";

interface SelectTodoStore {
  markedTodo?: Todo;
  selectedTodoIds: string[];
  selectTodo: (todo: Todo) => void;
  unselectAllTodos: () => void;
  selectAllTodos: (todos: Todo[]) => void;
  selectPreviousTodo: (todos: Todo[], todo?: Todo) => void;
  selectNextTodo: (todos: Todo[], todo?: Todo) => void;
  multiSelectPreviousTodo: (todos: Todo[], todo?: Todo) => void;
  multiSelectNextTodo: (todos: Todo[], todo?: Todo) => void;
}

export const useSelectTodoStore = create<SelectTodoStore>((set) => ({
  selectedTodoIds: [],
  unselectAllTodos: () => set({ selectedTodoIds: [], markedTodo: undefined }),
  selectTodo: (todo) =>
    set((state) => ({ ...state, selectedTodoIds: [todo.id], markedTodo: todo })),
  selectAllTodos: (todos) =>
    set((state) => ({
      ...state,
      selectedTodoIds: todos.map((todo) => todo.id),
      markedTodo: undefined,
    })),
  selectPreviousTodo: (todos, todo) =>
    set((state) => {
      const currentIndex = todos.findIndex((t) => t.id === todo?.id);
      const nextTodo = todos[currentIndex - 1];

      if (nextTodo) {
        return {
          ...state,
          selectedTodoIds: [nextTodo.id],
          markedTodo: nextTodo,
        };
      }

      return state;
    }),
  selectNextTodo: (todos, todo) =>
    set((state) => {
      const currentIndex = todos.findIndex((t) => t.id === todo?.id);
      const nextTodo = todos[currentIndex + 1];

      if (nextTodo) {
        return {
          selectedTodoIds: [nextTodo.id],
          markedTodo: nextTodo,
        };
      }

      return state;
    }),
  multiSelectPreviousTodo: (todos, todo) =>
    set((state) => {
      const currentIndex = todos.findIndex((t) => t.id === todo?.id);
      const nextTodo = todos[currentIndex - 1];

      if (state.selectedTodoIds.includes(nextTodo?.id)) {
        return {
          ...state,
          selectedTodoIds: state.selectedTodoIds.filter((todoId) => todoId !== todo?.id),
          markedTodo: nextTodo,
        };
      } else if (nextTodo) {
        return {
          ...state,
          selectedTodoIds: [...state.selectedTodoIds, nextTodo.id],
          markedTodo: nextTodo,
        };
      }

      return state;
    }),
  multiSelectNextTodo: (todos, todo) =>
    set((state) => {
      const currentIndex = todos.findIndex((t) => t.id === todo?.id);
      const nextTodo = todos[currentIndex + 1];

      if (state.selectedTodoIds.includes(nextTodo?.id)) {
        return {
          ...state,
          selectedTodoIds: state.selectedTodoIds.filter((todoId) => todoId !== todo?.id),
          markedTodo: nextTodo,
        };
      } else if (nextTodo) {
        return {
          ...state,
          selectedTodoIds: [...state.selectedTodoIds, nextTodo.id],
          markedTodo: nextTodo,
        };
      }

      return state;
    }),
}));
