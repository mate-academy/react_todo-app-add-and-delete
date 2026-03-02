import React from 'react';
import classNames from 'classnames';

type HeaderProps = {
  newTitle: string;
  setNewTitle: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  todosLength: number;
  allCompleted: boolean;
  onToggleAll: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  newTitle,
  setNewTitle,
  onSubmit,
  isLoading,
  inputRef,
  todosLength,
  allCompleted,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          id="new-todo-input"
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};

export default Header;
