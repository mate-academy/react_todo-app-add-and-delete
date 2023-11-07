import React from 'react';
import { FilterBy } from './types/FilterBy';

interface TodoFilterProps {
  filterBy: FilterBy;
  handleFilterClick: (filterType: FilterBy) =>
  (event: React.MouseEvent) => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  filterBy,
  handleFilterClick,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        onClick={handleFilterClick(FilterBy.All)}
        className={`filter__link ${filterBy === FilterBy.All ? 'selected' : ''}`}
        data-cy="FilterLinkAll"
      >
        All
      </a>
      <a
        href="#/active"
        onClick={handleFilterClick(FilterBy.Active)}
        className={`filter__link ${filterBy === FilterBy.Active ? 'selected' : ''}`}
        data-cy="FilterLinkActive"
      >
        Active
      </a>
      <a
        href="#/completed"
        onClick={handleFilterClick(FilterBy.Completed)}
        className={`filter__link ${filterBy === FilterBy.Completed ? 'selected' : ''}`}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
