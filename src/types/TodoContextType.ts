import { Dispatch, SetStateAction } from 'react';
import { Todo, Error, Filter } from './index';

export interface TodoContextType {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  addTodo: (newTodo: Todo) => void;
  removeTodo: (todoId: number) => void;
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  query: string;
  setQuery: (query: string) => void;
  error: Error;
  setError: Dispatch<SetStateAction<Error>>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  loadingTodosIds: number[];
  setLoadingTodosIds: Dispatch<SetStateAction<number[]>>;
}
