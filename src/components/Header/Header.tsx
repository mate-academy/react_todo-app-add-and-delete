import React from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = React.memo(({ newTodoField }) => {
  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="Toggle All"
      />

      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
});
