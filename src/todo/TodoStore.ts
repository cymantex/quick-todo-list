import { localStorageJson } from "local-storage-superjson";
import _ from "lodash";

export interface Todo {
  index: number;
  text: string;
  completed: boolean;
  subtasks: number[];
  parent?: number;
}

type TodoStoreSubscriber = (todos: Todo[]) => void;

interface TodoUpdate extends Partial<Todo> {
  index: number;
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
    const todos = this.getTodosSortedByIndex();

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
    this.notifySubscribers();
    return newTodo;
  }

  updateTodo(todo: TodoUpdate) {
    this.history.push([...this.todos]);
    localStorageJson.updateObject<Todo[]>(KEY, (prevTodos) =>
      prevTodos.map((prevTodo) =>
        prevTodo.index === todo.index ? { ...prevTodo, ...todo } : prevTodo,
      ),
    );
    this.notifySubscribers();
  }

  deleteTodos(todoIndexes: number[]) {
    this.history.push([...this.todos]);
    localStorageJson.updateObject<Todo[]>(KEY, (prevTodos) =>
      prevTodos
        .filter((prevTodo) => !todoIndexes.includes(prevTodo.index))
        .filter((prevTodo) => !todoIndexes.includes(prevTodo.parent || -1)),
    );
    this.notifySubscribers();
  }

  duplicate(todoIndexes: number[]) {
    this.history.push([...this.todos]);

    const newTodos = this.getTodos()
      .filter((todo) => todoIndexes.includes(todo.index))
      .map((todo, i) => {
        const newTodo = this.createNewTodo({
          text: todo.text,
          completed: todo.completed,
          subtasks: todo.subtasks,
        });
        newTodo.index = newTodo.index + i;
        return newTodo;
      });

    localStorageJson.updateObject<Todo[]>(KEY, (prevTodos) => [...prevTodos, ...newTodos]);
    this.notifySubscribers();
  }

  deleteTodo(todo: Todo) {
    this.history.push([...this.todos]);
    localStorageJson.updateObject<Todo[]>(KEY, (prevTodos) =>
      prevTodos
        .filter((prevTodo) => prevTodo.index !== todo.index)
        .filter((prevTodo) => !prevTodo.subtasks.includes(todo.index)),
    );
    this.notifySubscribers();
  }

  clearTodos() {
    this.history.push([...this.todos]);
    localStorage.clear();
    this.todos = this.initialState();
    this.notifySubscribers();
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

    this.notifySubscribers();
  }

  subscribe = (callback: TodoStoreSubscriber) => {
    this.subscribers.add(callback);
    return () => this.unsubscribe(callback);
  };

  private nextIndex = () => {
    const highestIndex: number = _.maxBy(this.getTodos(), (todo) => todo.index)?.index || 0;
    return highestIndex + 1;
  };

  private unsubscribe = (callback: TodoStoreSubscriber) => {
    this.subscribers.delete(callback);
  };

  private notifySubscribers = () => {
    const todos = this.getTodos();
    this.subscribers.forEach((subscriber) => subscriber(todos));
  };

  private initialState() {
    if (localStorageJson.getObject(KEY) == null) {
      localStorageJson.setObject(KEY, []);
    }

    return this.getTodosSortedByIndex()!;
  }

  private getTodosSortedByIndex() {
    return _.sortBy(localStorageJson.getObject<Todo[]>(KEY), (todo) => todo.index);
  }

  private createNewTodo(todo: TodoCreate) {
    return {
      index: this.nextIndex(),
      subtasks: [],
      completed: false,
      ...todo,
    };
  }
}

export const todoStore = new TodoStore();
