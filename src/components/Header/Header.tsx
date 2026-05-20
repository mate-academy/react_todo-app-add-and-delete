import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface Props {
  todos: Todo[];
  query: string;
  isSubmitting: boolean;
  activeTodosCount: number;
  allTodoCompleted: () => void;
  onSubmit: (event: React.FormEvent) => void;
  setQuery: (value: string) => void;
}

export const Header: React.FC<Props> = ({
  todos,
  query,
  isSubmitting,
  activeTodosCount,
  allTodoCompleted,
  onSubmit,
  setQuery,
}) => {
  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSubmitting) {
      newTodoFieldRef.current?.focus();
    }
  }, [isSubmitting, todos]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: activeTodosCount === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={() => allTodoCompleted()}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          ref={newTodoFieldRef}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
