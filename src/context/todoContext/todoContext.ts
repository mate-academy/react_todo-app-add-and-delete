import { createContext } from 'react';
import { Todo } from '../../types/Todo';

export interface TodoContextProps {
  todos: Todo[];
  addTodo: (title: string, userId: number) => void;
}

export const TodoContext = createContext<TodoContextProps>({
  todos: [],
  addTodo: () => { /* empty */ },
});
