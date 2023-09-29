import React, { useState } from 'react';
import cn from 'classnames';

type Props = {
  setFilter: (filter: string) => void,
  remainingTodos: number,
  activeTodos: number,
  handleClearAll: () => void,
};

export const Footer: React.FC<Props> = ({
  setFilter, remainingTodos, activeTodos, handleClearAll,
}) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleSetFilter = (filter: string) => {
    switch (filter) {
      case 'active':
        setActiveFilter('active');
        setFilter('active');
        break;

      case 'completed':
        setActiveFilter('completed');
        setFilter('completed');
        break;

      default:
        setActiveFilter('all');
        setFilter('all');
        break;
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {remainingTodos}
        {' '}
        items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: activeFilter === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleSetFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: activeFilter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleSetFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: activeFilter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleSetFilter('completed')}
        >
          Completed
        </a>
      </nav>

      {activeTodos > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearAll}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
};
