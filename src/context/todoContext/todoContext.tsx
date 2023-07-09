import { createContext } from 'react';
import { Todo } from '../../types/Todo';

export interface TodoContextProps {
  todos: Todo[],
  size: number,
  countCompleted: number,
  setTodos: (todos: Todo[]) => void,
  addTodo: (todo: Todo) => void;
  removeTodo: (id: number) => void,
  removeCompletedTodos: (ids: number[]) => void,
  removingTodoIds: number[],
  setRemovingTodoIds: (ids: number[]) => void,
}

export const TodoContext = createContext<TodoContextProps>({
  todos: [],
  size: 0,
  countCompleted: 0,
  removeCompletedTodos: () => {},
  setTodos: () => {},
  addTodo: () => { /* empty */ },
  removeTodo: () => {},
  removingTodoIds: [],
  setRemovingTodoIds: () => {},
});
