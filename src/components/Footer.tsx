import React from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Todo';

interface Props {
  activeCount: number;
  filter: Filter;
  setFilter: (f: Filter) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  activeCount,
  filter,
  setFilter,
  hasCompleted,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span data-cy="TodosCounter">
      {activeCount} {activeCount === 1 ? 'item left' : 'items left'}
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
      disabled={!hasCompleted}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
