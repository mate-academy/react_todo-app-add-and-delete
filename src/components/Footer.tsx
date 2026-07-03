import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../types/Filter';

interface Props {
  activeCount: number;
  completedCount: number;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  activeCount,
  completedCount,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} ${activeCount === 1 ? 'item' : 'items'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', { selected: filter === 'all' })}
          data-cy="FilterLinkAll"
          onClick={e => {
            e.preventDefault();
            onFilterChange('all');
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={e => {
            e.preventDefault();
            onFilterChange('active');
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={e => {
            e.preventDefault();
            onFilterChange('completed');
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
