import React from 'react';
import { ErrorText } from './ErrorText';
import { Status } from './Status';
import { Todo } from './Todo';

export interface ITodosStateContext {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  query: Status;
  setQuery: (query: Status) => void;
  errorMessage: ErrorText;
  setErrorMessage: (error: ErrorText) => void;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  processTodoIds: number[];
  setProcessTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
}
