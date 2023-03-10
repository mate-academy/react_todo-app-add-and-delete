import classnames from 'classnames';
import React, { useMemo } from 'react';
import { Todo } from './types/Todo';

type Props = {
  query: string,
  setQuery: (query: string) => void,
  todos: Todo[],
  onAdd: () => void,
  tempTodo:Todo | null,
};

export const Header: React.FC<Props> = ({
  query,
  setQuery,
  todos,
  onAdd,
  tempTodo,
}) => {
  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );
  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAdd();
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classnames(
          'todoapp__toggle-all',
          { active: activeTodos },
        )}
        aria-label="Add todo"
      />

      <form
        onSubmit={handleOnSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
