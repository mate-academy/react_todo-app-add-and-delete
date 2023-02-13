import React from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
  isListEmpty: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: (newTitle: string) => void;
};

export const Header: React.FC<Props> = React.memo(({
  isAdding,
  newTodoField,
  isListEmpty,
  onSubmit,
  title,
  setTitle,
}) => {
  return (
    <header className="todoapp__header">
      {isListEmpty || (
        <button
          data-cy="ToggleAllButton"
          type="button"
          aria-label="ToggleAllButton"
          className="todoapp__toggle-all active"
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
