import React from 'react';
import cn from 'classnames';

import { FilterOptions } from '../../types/FilterOptions';

type Props = {
  filter: FilterOptions;
  setFilter: (filter: FilterOptions) => void;
};

export const Filter: React.FC<Props> = ({ filter, setFilter }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filter === FilterOptions.ALL,
        })}
        onClick={() => setFilter(FilterOptions.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filter === FilterOptions.ACTIVE,
        })}
        onClick={() => setFilter(FilterOptions.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === FilterOptions.COMPLETED,
        })}
        onClick={() => setFilter(FilterOptions.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
