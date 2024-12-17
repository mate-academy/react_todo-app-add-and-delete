import React from 'react';

type HeaderProps = {
  query: string;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmiting: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export function Header({
  query,
  onInput,
  onSubmit,
  isSubmiting,
  inputRef,
}: HeaderProps) {
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
          type="text"
          value={query}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={onInput}
          disabled={isSubmiting}
          ref={inputRef}
        />
      </form>
    </header>
  );
}
