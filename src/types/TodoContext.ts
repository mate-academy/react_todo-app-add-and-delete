import React from 'react';
import { Todo } from './Todo';
import { Status } from './Status';

export interface TodoContext {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  status: Status,
  setStatus: React.Dispatch<React.SetStateAction<Status>>,
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  deletionId: number | null,
  setDeletionId: React.Dispatch<React.SetStateAction<number | null>>,
  closeErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  inputRef: React.RefObject<HTMLInputElement> | null,
  deleteTodosIds: number[],
  setDeleteTodosIds: React.Dispatch<React.SetStateAction<number[]>>,
}
