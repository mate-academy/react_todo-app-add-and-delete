import React from 'react';
import { Todo } from './types/Todo';

type TodoContextType = {
  filteredTodo:Todo[];
  deleteTodo: (id:number) => void
  setCount: (count: number) => void
  count:number
  setTodos:(v: Todo[]) => void
  todos:Todo[]
};

export const TodoContext = React.createContext<TodoContextType>({
  filteredTodo: [],
  deleteTodo: () => {},
  setCount: () => {},
  count: 0,
  setTodos: () => {},
  todos: [],
});
