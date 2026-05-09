import classNames from 'classnames';

import React from 'react';
import { Todo } from '../../types/todo';

type Props = {
  todos: Todo[];
  query: string;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onQueryChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  query,
  isLoading,
  inputRef,
  onQueryChange,
  onSubmit,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: todos.every(todo => todo.completed),
      })}
      data-cy="ToggleAllButton"
    />

    <form onSubmit={onSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={event => {
          onQueryChange(event.target.value);
        }}
        disabled={isLoading}
      />
    </form>
  </header>
);
