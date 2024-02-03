import React from 'react';
import { Status } from './Status';
import { Todo } from './Todo';

export interface Context {
  todos: Todo[],
  // setTodos: (todos: Todo[] | ((newTodos: Todo[]) => Todo[])) => void,
  // setTodos: (todos: Todo[]) => void,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  filterTodos: Status,
  setFilterTodos: (filterField: Status) => void,
  // titleField: string,
  // setTitleField: (value: string) => void,
  // tempTodo: Todo | null,
  // setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
}

export interface ContextUpdate {
  addTodo: (newTodo: Todo) => void,
  deleteTodo: (todoId: number) => void,
  // editTodo: (titleId: number, editTitle: string) => void,
  // clearCompleted: () => void,
}
