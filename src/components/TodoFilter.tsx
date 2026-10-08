import React from 'react';
import { TodoFilter as Filter } from '../types/TodoFilter';

type Props = {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
};

export const TodoFilter: React.FC<Props> = ({ filter, onFilterChange }) => (
  <nav className="filter" data-cy="Filter">
    <a
      href="#/"
      className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
      data-cy="FilterLinkAll"
      onClick={() => onFilterChange('all')}
    >
      All
    </a>

    <a
      href="#/active"
      className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
      data-cy="FilterLinkActive"
      onClick={() => onFilterChange('active')}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
      data-cy="FilterLinkCompleted"
      onClick={() => onFilterChange('completed')}
    >
      Completed
    </a>
  </nav>
);
