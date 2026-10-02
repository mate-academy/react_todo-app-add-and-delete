import React from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';
type Props = {
  activeTodosCount: number;
  selectedFilter: Filter;
  setSelectedFilter: (filter: Filter) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  selectedFilter,
  setSelectedFilter,
  hasCompleted,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedFilter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedFilter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedFilter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}

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
};
