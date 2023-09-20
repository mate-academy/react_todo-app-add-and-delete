import React, { useContext } from 'react';
import cn from 'classnames';

import { TodosContext } from '../../Context';

export const Header: React.FC = () => {
  const { todos } = useContext(TodosContext);
  const isToggleVisible = todos.some(todo => todo.completed);
  const isToggleActive = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      {isToggleVisible && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isToggleActive,
          })}
        />
      )}

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
