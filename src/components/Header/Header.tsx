import React from 'react';
import { TodoForm } from '../TodoForm';

interface Props {
  newTodoTitle: string;
  isSubmitting: boolean;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNewTodoSubmit: (e: React.FormEvent) => void;
}

export const Header: React.FC<Props> = ({
  newTodoTitle,
  isSubmitting,
  handleTitleChange,
  handleNewTodoSubmit,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />
      <TodoForm
        newTodoTitle={newTodoTitle}
        isSubmitting={isSubmitting}
        onTitleChange={handleTitleChange}
        onSubmit={handleNewTodoSubmit}
      />
    </header>
  );
};
