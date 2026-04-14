import React from 'react';
import cn from 'classnames';
import { Filter } from '../../App';

type Props = {
  notCompletedTodosLength: number;
  onFilterChange: (filter: Filter) => void;
  appliedFilter: Filter;
};

const FooterBase: React.FC<Props> = ({
  notCompletedTodosLength,
  onFilterChange,
  appliedFilter,
}) => {
  const todoCounterText = `${notCompletedTodosLength} ${notCompletedTodosLength === 1 ? 'item' : 'items'} left`;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todoCounterText}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: appliedFilter === 'All',
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: appliedFilter === 'Active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: appliedFilter === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange('Completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};

export const Footer = React.memo(FooterBase);
