import React from 'react';
import { Status } from './Status';
import { Todo } from './Todo';

export interface Context {
  todos: Todo[],
  setTodos: (todos: Todo[] | ((prev: Todo[]) => Todo[])) => void,
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  filterTodos: Status,
  setFilterTodos: (filterField: Status) => void,
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  isLoading: boolean,
  setIsLoading: (value: boolean) => void,
  deleteIds: number[],
  setDeleteIds: (n: number[]) => void,
}

export interface ContextUpdate {
  addTodo: (newTodo: Omit<Todo, 'id'>) => void,
  deleteTodo: (todoId: number) => void,
  // editTodo: (titleId: number, editTitle: string) => void,
  // clearCompleted: () => void,
}
