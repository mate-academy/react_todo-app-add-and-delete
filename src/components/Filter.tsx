import React from 'react';
import cn from 'classnames';

import { Filters } from '../types/Filters';

interface Props {
  filter: Filters;
  onChangeFilter: (filter: Filters) => void;
}

export const Filter: React.FC<Props> = ({ filter, onChangeFilter }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filter === Filters.ALL,
        })}
        onClick={() => onChangeFilter(Filters.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filter === Filters.ACTIVE,
        })}
        onClick={() => onChangeFilter(Filters.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === Filters.COMPLETED,
        })}
        onClick={() => onChangeFilter(Filters.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
