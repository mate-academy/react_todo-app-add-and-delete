import React from 'react';

type Props = {
  todoFieldRef: React.RefObject<HTMLInputElement>;
  query: string;
  setQuery: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  disabled: boolean;
};

export const Header: React.FC<Props> = ({
  todoFieldRef,
  query,
  setQuery,
  onSubmit,
  disabled,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          ref={todoFieldRef}
          autoFocus
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
