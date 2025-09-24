import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  onSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    input: React.RefObject<HTMLInputElement>,
  ) => void;
  query: string;
  onQuery: (q: string) => void;
  todos: Todo[];
  loading: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  onSubmit,
  query,
  onQuery,
  todos,
  loading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={event => onSubmit(event, inputRef)}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => onQuery(event.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
