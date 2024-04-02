import { Dispatch, SetStateAction } from 'react';
import { ErrorMessages } from './ErrorMessages';
import { FilterOptions } from './FilterOptions';
import { Todo } from './Todo';

export interface TodosContextType {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  errorMessage: ErrorMessages | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessages | null>>;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  tempTodo?: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
  filter: FilterOptions;
  setFilter: (filter: FilterOptions) => void;
  clearError: () => void;
  title: string;
  setTitle: (value: string) => void;
  showError: (error: ErrorMessages) => void;
  loadingTodosIds: number[];
  setLoadingTodosIds: Dispatch<SetStateAction<number[]>>;
  removeTodo: (id: number) => void;
}
