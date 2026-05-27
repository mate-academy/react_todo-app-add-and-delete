import { Todo } from '../types/Todo';
import classNames from 'classnames';
import React from 'react';

type Props = {
  todos: Todo[];
  activeTodos: Todo[];
  handleSubmit: (event: React.FormEvent) => void;
  todoTitle: string;
  setTodoTitle: (value: string) => void;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  todos,
  activeTodos,
  handleSubmit,
  todoTitle,
  setTodoTitle,
  loading,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !activeTodos.length,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          disabled={loading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
