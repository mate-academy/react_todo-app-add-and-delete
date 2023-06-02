import React from 'react';

type Props = {
  query: string;
  setQuery: (query: string) => void;
  onAdd: () => void;
  IsDisabled: boolean;
};

export const Header: React.FC<Props> = React.memo(({
  query,
  setQuery,
  onAdd,
  IsDisabled,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="toggle-all"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={(e) => {
          e.preventDefault();

          onAdd();
        }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={({ target }) => setQuery(target.value)}
          disabled={IsDisabled}
        />
      </form>
      {/* this buttons is active only if there are some active todos */}

    </header>
  );
});
