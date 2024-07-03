import { Dispatch, SetStateAction } from 'react';
import { Todo } from './Todo';
import { Status } from './Status';

export interface TodosContextType {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  query: Status;
  setQuery: Dispatch<SetStateAction<Status>>;
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  handleError: (message: string) => void;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  editingTodo: Todo | null;
  setEditingTodo: Dispatch<SetStateAction<Todo | null>>;
  loadingTodosIds: number[];
  setLoadingTodosIds: Dispatch<SetStateAction<number[]>>;
  isInputFocused: boolean;
  setIsInputFocused: Dispatch<SetStateAction<boolean>>;
}
