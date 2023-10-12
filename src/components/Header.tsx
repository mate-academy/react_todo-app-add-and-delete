import React from 'react';
import cn from 'classnames';

type Props = {
  todosLength: number,
  handleFormSubmit: () => void;
  query: string | number;
  setQuery: (event: string) => void;
  uncompletedTodos: number,
  toggleAll: () => void,
  pageIsLoaded: boolean,
};

export const Header: React.FC<Props> = React.memo(({
  todosLength,
  handleFormSubmit,
  query,
  setQuery,
  uncompletedTodos,
  toggleAll,
  pageIsLoaded,
}) => {
  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todosLength > 0 && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            { active: uncompletedTodos === 0 },
          )}
          data-cy="ToggleAllButton"
          onClick={() => {
            toggleAll();
          }}
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleFormSubmit();
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={!pageIsLoaded}
          value={query}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(event.target.value);
          }}
        />
      </form>
    </header>
  );
});
