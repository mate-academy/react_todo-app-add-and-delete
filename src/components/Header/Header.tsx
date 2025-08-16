import React, { RefObject } from 'react';
import classNames from 'classnames';

interface Props {
  query: string;
  onTitleChange: (value: string) => void;
  loadingItemIds: number[];
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  inputRef: RefObject<HTMLInputElement>;
  allCompleted: boolean;
  onToggleAll: () => void;
}

export const Header: React.FC<Props> = ({
  query,
  onTitleChange,
  loadingItemIds,
  handleSubmit,
  inputRef,
  allCompleted,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={query}
          onChange={e => onTitleChange(e.target.value)}
          placeholder="What needs to be done?"
          disabled={loadingItemIds.length !== 0}
          autoFocus
        />
      </form>
    </header>
  );
};

export * from './Header';
