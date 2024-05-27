import { Dispatch, SetStateAction } from 'react';
import { Todo } from './Todo';
import { Errors } from './Errors';
import { Status } from './Status';

export type TodoContext = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  errorMessage: Errors;
  setErrorMessage: Dispatch<SetStateAction<Errors>>;
  filter: Status;
  setFilter: Dispatch<SetStateAction<Status>>;
  resetError: () => void;
  loadingIds: number[];
  setLoadingIds: (todoId: number[]) => void;
};
