import { Dispatch, SetStateAction } from 'react';
import { Filter } from './Filter';
import { Todo } from './Todo';
import { ErrorMessage } from './ErrorMessage';

export interface TodosContextType {
  todos: Todo[];
  filter: Filter;
  addTodo: (newTodo: Todo) => void;
  removeTodo: (id: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  query: string;
  setQuery: (query: string) => void;
  error: ErrorMessage;
  setError: Dispatch<SetStateAction<ErrorMessage>>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  loadingTodosIDs: number[];
  setLoadingTodosIDs: React.Dispatch<React.SetStateAction<number[]>>;
}
