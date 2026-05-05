import type { Dispatch, SetStateAction } from 'react';

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum ErrorMessages {
  empty = '',
  notBeEmpty = 'Title should not be empty',
  addError = 'Unable to add a todo',
  deleteError = 'Unable to delete a todo',
  loadError = 'Unable to load todos',
}

export type TodoListProps = {
  filteredTodos: Todo[];
  deletingTodoIds: number[];
  tempTodo: Todo | null;
  handleDelete: (TodoId: number) => void;
};

export type FooterProps = {
  todos: Todo[];
  filter: string;
  setFilter: (filter: string) => void;
  checkComplete: boolean;
  handleClearCompleted: () => void;
};

export type ErrorNotificationsProps = {
  errorMessage: ErrorMessages;
  setErrorMessage: Dispatch<SetStateAction<ErrorMessages>>;
};
