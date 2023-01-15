import { Todo } from './Todo';

export interface TodoContextType {
  todos: Todo[],
  setTodos: (value: Todo[] | any) => void,
  visibleTodos: Todo[],
  setVisibleTodos: (value: Todo[] | any) => void,
}
