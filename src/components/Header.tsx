import React, { useEffect } from 'react';

type Props = {
  onQuery: (query: string) => void;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  query: string;
};
export const Header: React.FC<Props> = ({
  onQuery,
  loading,
  inputRef,
  onSubmit,
  query,
}) => {
  useEffect(() => {
    if (inputRef.current && !loading) {
      inputRef.current.focus();
    }
  }, [inputRef, loading]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={event => {
          onSubmit(event);
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => onQuery(event.target.value)}
          ref={inputRef}
          disabled={loading}
        />
      </form>
    </header>
  );
};
