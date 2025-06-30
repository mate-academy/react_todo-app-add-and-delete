import React, { useEffect, RefObject } from 'react';
import { Todo } from '../../types/TodoProps';

interface HeaderProps {
  todos: Todo[];
  query: string;
  setQuery: (value: string) => void;
  onFormSubmit: (event: React.FormEvent) => void;
  onToggleAll: () => void;
  isAdding: boolean;
  inputRef: RefObject<HTMLInputElement>;
  onFocusInput: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  query,
  setQuery,
  onFormSubmit,
  onToggleAll,
  isAdding,
  inputRef,
  onFocusInput,
}) => {
  const allCompleted = todos?.every(todo => todo.completed);

  useEffect(() => {
    if (!isAdding && !query) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      return () => clearTimeout(timer);
    }

    return;
  }, [query, isAdding, inputRef]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
        aria-label="Toggle all todos"
      />
      <form
        onSubmit={e => {
          e.preventDefault();
          onFormSubmit(e);
        }}
      >
        <input
          id="newTodo"
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={isAdding}
          onFocus={onFocusInput}
        />
      </form>
    </header>
  );
};
