import React from 'react';
import { AddTodoForm } from '../AddTdoForm';
import { ErrorType } from '../../types/ErrorType';

interface Props {
  userId: number;
  onAddTodo: (title: string, userId: number) => void;
  onAddErrorMessage: (message: ErrorType) => void;
  isLoading: boolean;
}

export const Header: React.FC<Props> = ({
  userId,
  onAddTodo,
  onAddErrorMessage,
  isLoading,
}) => (
  <header className="todoapp__header">
    {/* this buttons is active only if there are some active todos */}
    <button
      type="button"
      className="todoapp__toggle-all active"
      aria-label="active todos"
    />

    <AddTodoForm
      userId={userId}
      onAddTodo={onAddTodo}
      onAddErrorMessage={onAddErrorMessage}
      isLoading={isLoading}
    />
  </header>
);
