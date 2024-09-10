import React from 'react';

interface HeaderProps {
  inputRef: React.RefObject<HTMLInputElement>;
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  inputText: string;
  onInputChange: (value: string) => void;
  inputDisabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  inputRef,
  submitHandler,
  inputText,
  onInputChange,
  inputDisabled,
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
      <form onSubmit={submitHandler}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputText}
          onChange={e => onInputChange(e.target.value)}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
