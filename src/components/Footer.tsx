// components/Footer.tsx
import React from 'react';
import classNames from 'classnames';

type FooterProps = {
  remainingCount: number;
  filter: 'all' | 'active' | 'completed';
  setFilter: (f: 'all' | 'active' | 'completed') => void;
  onClearCompleted: () => void;
  hasCompletedTodos: boolean;
};

export const Footer: React.FC<FooterProps> = ({
  remainingCount,
  filter,
  setFilter,
  onClearCompleted,
  hasCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${remainingCount} item${remainingCount !== 1 ? 's' : ''} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', { selected: filter === 'all' })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter('all')}
        >
          All
        </a>
        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter('active')}
        >
          Active
        </a>
        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
