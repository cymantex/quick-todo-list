import { create } from "zustand";
import { Todo } from "@/todo/TodoStore";

interface SelectTodoStore {
  markedTodo?: Todo;
  selectedTodoIndexes: number[];
  selectTodo: (todo: Todo) => void;
  unselectAllTodos: () => void;
  selectAllTodos: (todos: Todo[]) => void;
  selectPreviousTodo: (todos: Todo[], currentIndex: number) => void;
  selectNextTodo: (todos: Todo[], currentIndex: number) => void;
  multiSelectPreviousTodo: (todos: Todo[], currentIndex: number, lastIndex: number) => void;
  multiSelectNextTodo: (todos: Todo[], currentIndex: number, lastIndex: number) => void;
}

export const useSelectTodoStore = create<SelectTodoStore>((set) => ({
  selectedTodoIndexes: [] as number[],
  unselectAllTodos: () => set({ selectedTodoIndexes: [], markedTodo: undefined }),
  selectTodo: (todo) =>
    set((state) => ({ ...state, selectedTodoIndexes: [todo.index], markedTodo: todo })),
  selectAllTodos: (todos) =>
    set((state) => ({
      ...state,
      selectedTodoIndexes: todos.map((todo) => todo.index),
      markedTodo: undefined,
    })),
  selectPreviousTodo: (todos, currentIndex) =>
    set((state) => {
      if (currentIndex - 1 >= 0) {
        const todo = todos[currentIndex - 1];
        return {
          ...state,
          selectedTodoIndexes: [todo.index],
          markedTodo: todo,
        };
      }

      return state;
    }),
  selectNextTodo: (todos, currentIndex) =>
    set((state) => {
      const todo = todos[currentIndex + 1];
      if (currentIndex + 1 < todos.length) {
        return {
          selectedTodoIndexes: [todo.index],
          markedTodo: todo,
        };
      }

      return state;
    }),
  multiSelectPreviousTodo: (todos, currentIndex, lastIndex) =>
    set((state) => {
      const todo = todos[currentIndex - 1];
      const indexToSelect = todo?.index;

      if (state.selectedTodoIndexes.includes(indexToSelect)) {
        return {
          ...state,
          selectedTodoIndexes: state.selectedTodoIndexes.filter((index) => index !== lastIndex),
          markedTodo: todo,
        };
      } else if (currentIndex - 1 >= 0) {
        return {
          ...state,
          selectedTodoIndexes: [...state.selectedTodoIndexes, indexToSelect],
          markedTodo: todo,
        };
      }

      return state;
    }),
  multiSelectNextTodo: (todos, currentIndex, lastIndex) =>
    set((state) => {
      const todo = todos[currentIndex + 1];
      const indexToSelect = todo?.index;

      if (state.selectedTodoIndexes.includes(indexToSelect)) {
        return {
          ...state,
          selectedTodoIndexes: state.selectedTodoIndexes.filter((index) => index !== lastIndex),
          markedTodo: todo,
        };
      } else if (currentIndex - 1 >= 0) {
        return {
          ...state,
          selectedTodoIndexes: [...state.selectedTodoIndexes, indexToSelect],
          markedTodo: todo,
        };
      }

      return state;
    }),
}));
