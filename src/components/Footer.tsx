import React from 'react';
import cn from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  activeTodosCount: number;
  completedTodosCount: number;
  selectedFilter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  completedTodosCount,
  selectedFilter,
  onFilterChange,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeTodosCount} ${activeTodosCount === 1 ? 'item' : 'items'} left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: selectedFilter === Filter.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterChange(Filter.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: selectedFilter === Filter.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onFilterChange(Filter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: selectedFilter === Filter.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onFilterChange(Filter.Completed)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={completedTodosCount === 0}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
