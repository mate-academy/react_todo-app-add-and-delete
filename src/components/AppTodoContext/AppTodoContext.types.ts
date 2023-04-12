import React, { ReactNode, SetStateAction } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../Error/Error.types';

export interface Props {
  children: ReactNode
}

export interface Value {
  todos: Todo[],
  setTodos: React.Dispatch<SetStateAction<Todo[]>>,
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<SetStateAction<Todo | null>>,
  deletingTodoIDs: number[],
  setDeletingTodoIDs: React.Dispatch<SetStateAction<number[]>>,
  errorMessage: ErrorType,
  setErrorMessage: React.Dispatch<SetStateAction<ErrorType>>
}
