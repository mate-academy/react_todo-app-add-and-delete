import React from 'react';

interface Props {
  newTitle: string;
  setNewTitle: (title: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isInputDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  onSubmit,
  isInputDisabled,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
      />
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
          autoFocus
          ref={inputRef}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};

export default Header;
