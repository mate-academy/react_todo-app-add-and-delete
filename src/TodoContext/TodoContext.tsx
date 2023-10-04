import React, { FormEvent } from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/FilterEnum';

type Props = {
  preparedTodos: Todo[];
  todos: Todo[];
  setTodos: (newTodos: Todo[]) => void;
  filterBy: string;
  setFilterBy: (item: Status) => void;
  errorOccured: string;
  setErrorOccured: (ErrorMessage: string) => void;
  USER_ID: number;
  title: string,
  setTitle: (title: string) => void;
  handleSubmit: (event: FormEvent) => void;
  handleDelete: (todo: Todo) => void;
  isTodoChange: boolean;
  changingItems: number[];
};

export const TodoContext = React.createContext<Props>({
  preparedTodos: [],
  todos: [],
  setTodos: () => { },
  filterBy: '',
  setFilterBy: () => { },
  errorOccured: '',
  setErrorOccured: () => {},
  USER_ID: 11589,
  title: '',
  setTitle: () => {},
  handleSubmit: () => {},
  handleDelete: () => {},
  isTodoChange: false,
  changingItems: [],
});
