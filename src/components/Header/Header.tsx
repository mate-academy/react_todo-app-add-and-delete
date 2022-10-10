import React, { FormEvent, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  todosCompleted: Todo[];
  handleSubmit: (event: FormEvent) => void;
  title: string;
  setTitle: (str: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  todosCompleted,
  handleSubmit,
  title,
  setTitle,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          aria-label="label"
          className={classNames(
            'todoapp__toggle-all',
            {
              active: todos.length === todosCompleted.length,
            },
          )}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
