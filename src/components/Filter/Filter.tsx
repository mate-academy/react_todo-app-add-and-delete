import React from 'react';
import { SortType } from '../../types/sortField';

type Props = {
  sortField: SortType;
  onFilter: (field: SortType) => void;
};

export const Filter: React.FC<Props> = ({ sortField, onFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${sortField === SortType.default ? 'selected' : ''}`}
        data-cy="FilterLinkAll"
        onClick={() => onFilter(SortType.default)}
      >
        All
      </a>

      <a
        href="#/active"
        className={`filter__link ${sortField === SortType.active ? 'selected' : ''}`}
        data-cy="FilterLinkActive"
        onClick={() => onFilter(SortType.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={`filter__link ${sortField === SortType.completed ? 'selected' : ''}`}
        data-cy="FilterLinkCompleted"
        onClick={() => onFilter(SortType.completed)}
      >
        Completed
      </a>
    </nav>
  );
};
