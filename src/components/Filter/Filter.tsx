import React from 'react';
import cn from 'classnames';

import { Filters } from '../../types/Filter';

interface Props {
  filter: Filters;
  onFilterChange: (filter: Filters) => void;
}

export const Filter: React.FC<Props> = ({ filter, onFilterChange }) => (
  <nav className="filter">
    <a
      href="#/"
      className={cn('filter__link', {
        selected: filter === Filters.ALL,
      })}
      onClick={() => onFilterChange(Filters.ALL)}
    >
      All
    </a>

    <a
      href="#/active"
      className={cn('filter__link', {
        selected: filter === Filters.ACTIVE,
      })}
      onClick={() => onFilterChange(Filters.ACTIVE)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={cn('filter__link', {
        selected: filter === Filters.COMPLETED,
      })}
      onClick={() => onFilterChange(Filters.COMPLETED)}
    >
      Completed
    </a>
  </nav>
);
