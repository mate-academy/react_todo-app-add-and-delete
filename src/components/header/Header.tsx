import React, { useState } from 'react';

type Props = {
  handleSubmit: (query: string) => Promise<boolean>;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  handleSubmit,
  disabled,
  inputRef,
}) => {
  const [query, setQuery] = useState('');

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
        onSubmit={async event => {
          event.preventDefault();

          const success = await handleSubmit(query);

          if (success) {
            setQuery('');
          }
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          disabled={disabled}
          autoFocus
          ref={inputRef}
        />
      </form>
    </header>
  );
};
