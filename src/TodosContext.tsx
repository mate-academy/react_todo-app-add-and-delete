import React from 'react';
import { Error } from './types/Error';
import { Todo } from './types/Todo';

type State = {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  error: Error;
  setError: (e: Error) => void;
  setTempTodo: (newTodo: Todo | null) => void;
  deleteTodo: (id: number) => Promise<unknown>;
  addTodo: (data: Omit<Todo, 'id'>) => Promise<void>;
  setDeletingTodosId: (id: number[]) => void;
  deletingTodosId: number[];
};

const initialState: State = {
  tempTodo: null,
  todos: [],
  setTodos: () => {},
  setTempTodo: () => {},
  error: Error.None,
  setError: () => {},
  deleteTodo: () => new Promise<unknown>(() => {}),
  addTodo: () => new Promise<void>(() => {}),
  setDeletingTodosId: () => {},
  deletingTodosId: [],
};

export const TodosContext = React.createContext(initialState);
