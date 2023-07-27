import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
};

export const Header: React.FC<Props> = ({ todos }) => {
  return (
    <header className="todoapp__header">
      {
        todos.length > 0 && (
          <button
            type="button"
            className="todoapp__toggle-all active"
            aria-label="toggle"
          />
        )
      }

      {/* Add a todo on form submit */}
      <form>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
