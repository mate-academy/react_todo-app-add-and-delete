import React from 'react';
import { Todo } from './types/Todo';

type TodoContextType = {
  filteredTodo:Todo[];
  deleteTodo: (id:number) => void
  setCount: (count: number) => void
  count:number
  setTodos:(v: Todo[]) => void
  todos:Todo[]
  isSubmitting: boolean,
  setIsSubmiting:(v: boolean) => void,
  isDeliting: boolean,
  setIsDeliting:(v: boolean) => void,
  setSelectedTodo:(v: number) => void,
  selectedTodo: number,
  clear: boolean,
};

export const TodoContext = React.createContext<TodoContextType>({
  filteredTodo: [],
  deleteTodo: () => {},
  setCount: () => {},
  count: 0,
  setTodos: () => {},
  todos: [],
  isSubmitting: false,
  setIsSubmiting: () => {},
  isDeliting: false,
  setIsDeliting: () => {},
  setSelectedTodo: () => {},
  selectedTodo: 0,
  clear: false,
});
