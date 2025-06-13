import React from 'react';
import { AddTodoForm } from '../AddTodoForm';
import { ErrorMessage } from '../../enums/errorMessage';

type Props = {
  setErrorMessage: (errorMessage: ErrorMessage) => void;
  onAddTodo: (todoTitle: string) => Promise<void>;
  isAddTodoFormFocused: boolean;
  setIsAddTodoFormFocused: (isFocused: boolean) => void;
};

export const Header: React.FC<Props> = ({
  setErrorMessage,
  onAddTodo,
  isAddTodoFormFocused,
  setIsAddTodoFormFocused,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <AddTodoForm
        setErrorMessage={setErrorMessage}
        onAdd={onAddTodo}
        isAddTodoFormFocused={isAddTodoFormFocused}
        setIsAddTodoFormFocused={setIsAddTodoFormFocused}
      />
    </header>
  );
};
