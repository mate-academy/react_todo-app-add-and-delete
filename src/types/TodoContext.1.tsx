import React from 'react';
import { Todo } from './Todo';
import { Status } from './Status';

export interface TodoContext {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
  setCompleted: (todoID: number) => void;
  makeAllCompleted: (todos: Todo[]) => void;
  query: Status;
  setQuery: React.Dispatch<React.SetStateAction<Status>>;
  filteredTodos: Todo[];
  deleteCompletedTodos: () => void;
  deleteTodo: (id: number) => void;
  saveEditingTitle: (todoId: number, todoNewTitle: string) => void;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  tempTodo: null | Todo;
  setTempTodo: React.Dispatch<React.SetStateAction<null | Todo>>;
  deleteTodosId: number[];
  setDeleteTodosId: React.Dispatch<React.SetStateAction<number[]>>;
}
