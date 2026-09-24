import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../types/Filter';

interface Props {
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  hasCompletedTodos,
  currentFilter,
  onFilterChange,
  onClearCompleted,
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
            selected: currentFilter === FilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: currentFilter === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: currentFilter === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(FilterType.Completed)}
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
