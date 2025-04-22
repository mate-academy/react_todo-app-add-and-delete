import React from 'react';
import { Todo } from '../../types/Todo';

export type HeaderTypes = {
  setCustomError: (err: string) => void;
  customError: string;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleLoaderId: (todo: Todo) => void;
  titleField: React.RefObject<HTMLInputElement>;
};
