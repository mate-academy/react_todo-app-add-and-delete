import React, { RefObject } from 'react';
import classNames from 'classnames';

interface Props {
  newTitle: string;
  setNewTitle: (title: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onToggleAll: () => void;
  loading: boolean;
  todosCount: number;
  allCompleted: boolean;
  inputRef: RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  onSubmit,
  onToggleAll,
  loading,
  todosCount,
  allCompleted,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todosCount > 0 && allCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          autoFocus
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={loading}
          data-cy="NewTodoField"
        />
      </form>
    </header>
  );
};
