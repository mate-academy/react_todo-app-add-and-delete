import React from 'react';
import cn from 'classnames';

interface Props {
  filter: string;
  setFilter: (filter: string) => void;
  activeCount: number;
  onClearCompleted: () => void;
  hasCompleted: boolean;
}

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  activeCount,
  onClearCompleted,
  hasCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === 'all' })}
          onClick={() => setFilter('all')}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: filter === 'active' })}
          onClick={() => setFilter('active')}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', { selected: filter === 'completed' })}
          onClick={() => setFilter('completed')}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      {hasCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
