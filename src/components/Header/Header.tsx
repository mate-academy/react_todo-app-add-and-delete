import { FC, useEffect, useRef } from 'react';

import { Todo } from '../../types';

export interface IHeader {
  todos: Todo[];
}

export const Header: FC<IHeader> = ({ todos }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const allCompleted = todos.every(todo => todo.completed === true);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all  ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
