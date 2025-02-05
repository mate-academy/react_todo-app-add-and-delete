import React, { RefObject } from 'react';

interface HeaderProps {
  handleSubmit: (event: React.FormEvent) => void;
  title: string;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  inputRef: RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderProps> = ({
  handleSubmit,
  title,
  handleTitleChange,
  isLoading,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo focused"
          placeholder="Title should not be empty"
          value={title}
          onChange={handleTitleChange}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
