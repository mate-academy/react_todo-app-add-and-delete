import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  isCompleted: string;
  setIsCompleted: (todoStatus: string) => void;
};

export const TodoFilter: React.FC<Props> = ({
  todos,
  isCompleted,
  setIsCompleted,
}) => {
  const handleSelect = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setIsCompleted(event.currentTarget.getAttribute('href')?.slice(2) || 'all');
  };

  const count = () => {
    const incompleteTodos = todos.filter(todo => todo.completed === false);

    return incompleteTodos.length;
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${count()} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: isCompleted === 'all' })}
          onClick={handleSelect}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: isCompleted === 'active' })}
          onClick={handleSelect}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: isCompleted === 'completed' })}
          onClick={handleSelect}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button type="button" className="todoapp__clear-completed">
        Clear completed
      </button>
    </footer>
  );
};
