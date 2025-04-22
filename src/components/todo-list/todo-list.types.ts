import { Todo } from '../../types/Todo';
import React from 'react';

export type TodoListTypes = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setCustomError: (err: string) => void;
  customError: string;
  loadingId: { [key: number]: boolean };
  handleLoaderId: (todo: Todo) => void;
  titleField: React.RefObject<HTMLInputElement>;
};
