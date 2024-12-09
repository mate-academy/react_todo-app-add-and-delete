import React from 'react';
import { useRef, useEffect } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  noTodos: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  title: string;
  onTitleChange: (arg: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  noTodos,
  onSubmit,
  loading,
  title,
  onTitleChange,
}) => {
  const areAllCompleted = todos.every(todo => todo.completed);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  return (
    <header className="todoapp__header">
      {!noTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={event => onSubmit(event)}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => onTitleChange(event.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
