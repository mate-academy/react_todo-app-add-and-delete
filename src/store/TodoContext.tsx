import { createContext } from 'react';
import { Todo } from '../types/Todo';

export interface Props {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  deletingIds: number[];
  setDeletingIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const TodoContext = createContext<Props>({
  todos: [],
  setTodos: () => {},
  deletingIds: [],
  setDeletingIds: () => {},
});
