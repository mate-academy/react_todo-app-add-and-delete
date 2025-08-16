import React, { RefObject } from 'react';

interface Props {
  query: string;
  onTitleChange: (value: string) => void;
  loadingItemIds: number[];
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  inputRef: RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  query,
  onTitleChange,
  loadingItemIds,
  handleSubmit,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
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
