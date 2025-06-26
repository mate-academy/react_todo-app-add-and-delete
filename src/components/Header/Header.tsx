import React, { RefObject } from 'react';
import classNames from 'classnames';

interface HeaderProps {
  todosCount: number;
  allCompleted: boolean;
  isLoading: boolean;
  newTodo: string;
  inputRef: RefObject<HTMLInputElement>;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (event: React.FormEvent) => void;
}

export const Header: React.FC<HeaderProps> = ({
  todosCount,
  allCompleted,
  isLoading,
  newTodo,
  inputRef,
  handleInputChange,
  handleFormSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todosCount > 0 && allCompleted,
        })}
        data-cy="ToggleAllButton"
        disabled={isLoading || todosCount === 0}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleFormSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          value={newTodo}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
