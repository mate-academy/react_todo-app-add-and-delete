import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
};

export const Header: React.FC<Props> = ({ todos }) => {
  const completedTodos = todos.every(todo => todo.completed);
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodos,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputField}
        />
      </form>
    </header>
  );
};
