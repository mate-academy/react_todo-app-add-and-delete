import { Todo } from './Todo';

export type Todos = {
  todos: Todo[];
  setTodos: (t: Todo[]) => void;
};
