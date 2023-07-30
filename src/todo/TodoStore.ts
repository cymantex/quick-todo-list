import { v4 as uuid } from "uuid";
import { localStorageJson } from "local-storage-superjson";
import _, { last } from "lodash";

export interface Todo {
  id: string;
  sortIndex: number;
  text: string;
  completed: boolean;
  subtasks: number[];
  parent?: string;
}

type TodoStoreSubscriber = (todos: Todo[]) => void;

interface TodoUpdate extends Partial<Todo> {
  sortIndex: number;
}

interface TodoCreate {
  text: string;
  completed?: boolean;
  subtasks?: number[];
}

const KEY = "todos";

export class TodoStore {
  private readonly subscribers: Set<TodoStoreSubscriber>;
  private todos: Todo[];
  private history: Todo[][];

  constructor() {
    this.subscribers = new Set<TodoStoreSubscriber>();
    this.todos = this.initialState();
    this.history = [];
  }

  getTodos = (): Todo[] => {
    const todos = this.getTodosBySortIndex();

    if (_.isEqual(todos, this.todos)) {
      return this.todos;
    } else if (todos == null) {
      return this.initialState();
    }

    this.todos = todos;
    return todos;
  };

  addTodo(todo: TodoCreate): Todo {
    this.history.push([...this.todos]);
    const newTodo = this.createNewTodo(todo);
    localStorageJson.updateObject<Todo[]>(KEY, (prevTodos) => [...prevTodos, newTodo]);
    this.handleChange();
    return newTodo;
  }

  updateTodo(todo: TodoUpdate) {
    this.history.push([...this.todos]);
    localStorageJson.updateObject<Todo[]>(KEY, (prevTodos) =>
      prevTodos.map((prevTodo) =>
        prevTodo.sortIndex === todo.sortIndex ? { ...prevTodo, ...todo } : prevTodo,
      ),
    );
    this.handleChange();
  }

  deleteTodos(todoIds: string[]) {
    this.history.push([...this.todos]);
    localStorageJson.updateObject<Todo[]>(KEY, (prevTodos) =>
      prevTodos
        .filter((prevTodo) => !todoIds.includes(prevTodo.id))
        .filter((prevTodo) => !todoIds.includes(prevTodo.parent || "")),
    );

    this.handleChange();
  }

  moveUp(todoIds: string[]) {
    function getUpSortIndex(todo?: Todo) {
      return (todo?.sortIndex || 1) - 1;
    }

    this.move(
      todoIds,
      (todosToMove) => getUpSortIndex(todosToMove[0]),
      (todosToMove) => last(todosToMove)?.sortIndex || 0,
      (todo) => getUpSortIndex(todo),
    );
  }

  moveDown(todoIds: string[]) {
    const lastIndex = this.getStoredTodos().length - 1;

    function getDownSortIndex(todo?: Todo | undefined) {
      if (!todo || todo.sortIndex >= lastIndex) {
        return lastIndex;
      }

      return todo.sortIndex + 1;
    }

    this.move(
      todoIds,
      (todosToMove) => getDownSortIndex(last(todosToMove)),
      (todosToMove) => todosToMove[0]?.sortIndex,
      (todo) => getDownSortIndex(todo),
    );
  }

  private move(
    todoIds: string[],
    getSwapTargetIndex: (todosToMove: Todo[]) => number | undefined,
    getSwapDestinationIndex: (todoToMove: Todo[]) => number | undefined,
    getNextSortIndex: (todo: Todo) => number,
  ) {
    this.history.push([...this.todos]);

    const todos = this.getStoredTodos();
    let todosToMove = todos.filter((todo) => todoIds.includes(todo.id));
    const swapTargetIndex = getSwapTargetIndex(todosToMove);
    const swapDestinationIndex = getSwapDestinationIndex(todosToMove);
    todosToMove = todosToMove.map((todo) => ({ ...todo, sortIndex: getNextSortIndex(todo) }));
    console.log(swapTargetIndex, swapDestinationIndex, todosToMove);
    const otherTodos = todos
      .filter((todo) => !todoIds.includes(todo.id))
      .map((todo) => ({
        ...todo,
        sortIndex: todo.sortIndex === swapTargetIndex ? swapDestinationIndex : todo.sortIndex,
      }));
    console.log(otherTodos);
    const sortedTodos = _.sortBy([...todosToMove, ...otherTodos], (todo) => todo.sortIndex);

    localStorageJson.setObject(KEY, sortedTodos);
    this.handleChange();
  }

  duplicate(todoIds: string[]) {
    this.history.push([...this.todos]);

    const newTodos = this.getStoredTodos()
      .filter((todo) => todoIds.includes(todo.id))
      .map((todo, i) => {
        const newTodo: Todo = this.createNewTodo({
          text: todo.text,
          completed: todo.completed,
          subtasks: todo.subtasks,
        });
        newTodo.sortIndex = newTodo.sortIndex + i;
        return newTodo;
      });

    localStorageJson.updateObject<Todo[]>(KEY, (prevTodos) => [...prevTodos, ...newTodos]);
    this.handleChange();
  }

  undo() {
    if (this.history.length === 0) {
      return;
    }

    const todos = this.history.pop()!;

    if (_.isEqual(todos, this.todos)) {
      return;
    }

    localStorageJson.setObject(KEY, todos);
    this.todos = todos;

    this.handleChange();
  }

  subscribe = (callback: TodoStoreSubscriber) => {
    this.subscribers.add(callback);
    return () => this.unsubscribe(callback);
  };

  private handleChange() {
    this.reindexTodos();
    this.notifySubscribers();
  }

  private reindexTodos = () => {
    const todos = this.getTodosBySortIndex();
    let index = 0;
    todos.forEach((todo) => {
      todo.sortIndex = index;
      index++;
    });
    localStorageJson.setObject(KEY, todos);
  };

  private nextSortIndex = () => {
    const numberOfTodos = this.getStoredTodos()?.length || 0;
    return numberOfTodos + 1;
  };

  private unsubscribe = (callback: TodoStoreSubscriber) => {
    this.subscribers.delete(callback);
  };

  private notifySubscribers = () => {
    const todos = this.getStoredTodos();
    this.subscribers.forEach((subscriber) => subscriber(todos));
  };

  private initialState() {
    if (localStorageJson.getObject(KEY) == null) {
      localStorageJson.setObject(KEY, []);
    }

    return this.getTodosBySortIndex()!;
  }

  private getTodosBySortIndex() {
    return _.sortBy(this.getStoredTodos(), (todo) => todo.sortIndex);
  }

  private getStoredTodos(): Todo[] {
    return localStorageJson.getObject<Todo[]>(KEY) || [];
  }

  private createNewTodo(todo: TodoCreate): Todo {
    return {
      id: uuid(),
      sortIndex: this.nextSortIndex(),
      subtasks: [],
      completed: false,
      ...todo,
    };
  }
}

export const todoStore = new TodoStore();
