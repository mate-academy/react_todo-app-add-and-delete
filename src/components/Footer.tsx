import React from 'react';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  activeCount: number;
  filter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  onClearCompleted: () => void;
  hasCompletedTodos: boolean;
};

export const Footer: React.FC<Props> = ({
  activeCount,
  filter,
  onFilterChange,
  onClearCompleted,
  hasCompletedTodos,
}) => {
  const handleFilterClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    status: FilterStatus,
  ) => {
    event.preventDefault();
    onFilterChange(status);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${
            filter === FilterStatus.All ? 'selected' : ''
          }`}
          data-cy="FilterLinkAll"
          onClick={e => handleFilterClick(e, FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${
            filter === FilterStatus.Active ? 'selected' : ''
          }`}
          data-cy="FilterLinkActive"
          onClick={e => handleFilterClick(e, FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${
            filter === FilterStatus.Completed ? 'selected' : ''
          }`}
          data-cy="FilterLinkCompleted"
          onClick={e => handleFilterClick(e, FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
