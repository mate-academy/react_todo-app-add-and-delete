import React from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

type Props = {
  todos: Todo[],
  setTodos: (newTodos: Todo[]) => void,
  status: Status,
  setStatus: (status: Status) => void,
  errorMessage: string,
  setErrorMessage: (value: string) => void,
};

export const TodosContext = React.createContext<Props>({
  todos: [],
  setTodos: () => {},
  status: Status.all,
  setStatus: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
});
