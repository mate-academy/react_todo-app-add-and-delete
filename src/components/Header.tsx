import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  query: string;
  setQuery: (value: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
  toggleAll: () => void;
  isLoading: boolean;
  tempTodo: Todo | null;
  todoFieldRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  todos,
  query,
  setQuery,
  handleSubmit,
  toggleAll,
  isLoading,
  tempTodo,
  todoFieldRef,
}) => {
  return (
    <header className="todoapp__header">
      {!isLoading && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            acitve: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={todoFieldRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={query}
          onChange={event => setQuery(event.target.value)}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
