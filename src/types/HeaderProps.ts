import React from 'react';
import { Todo } from './Todo';

export interface HeaderProps {
  todos: Todo[];
  handleNewTodoFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  newTodoInput: React.RefObject<HTMLInputElement>;
  isSending: boolean;
}
