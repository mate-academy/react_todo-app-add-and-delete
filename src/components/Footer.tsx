import React from 'react';
import cn from 'classnames';

export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

interface Props {
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  filterBy: FilterStatus;
  setFilterBy: (filter: FilterStatus) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  hasCompletedTodos,
  filterBy,
  setFilterBy,
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
          className={cn('filter__link', {
            selected: filterBy === FilterStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterBy(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === FilterStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterBy(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === FilterStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterBy(FilterStatus.Completed)}
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
