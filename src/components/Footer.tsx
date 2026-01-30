import React, { memo } from 'react';
import { FilterState } from '../App';
import classNames from 'classnames';

interface Props {
  activeTodosCount: number;
  selectedFilter: FilterState;
  hasCompleted: boolean;
  handleFilterChange: (
    event: React.MouseEvent,
    newFilterState: FilterState,
  ) => void;
}

export const FooterComponent: React.FC<Props> = ({
  activeTodosCount,
  selectedFilter,
  hasCompleted,
  handleFilterChange,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedFilter === FilterState.All,
          })}
          onClick={event => handleFilterChange(event, FilterState.All)}
          data-cy="FilterLinkAll"
        >
          All
        </a>
        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedFilter === FilterState.Active,
          })}
          onClick={event => handleFilterChange(event, FilterState.Active)}
          data-cy="FilterLinkActive"
        >
          Active
        </a>
        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedFilter === FilterState.Completed,
          })}
          onClick={event => handleFilterChange(event, FilterState.Completed)}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export const Footer = memo(FooterComponent);
