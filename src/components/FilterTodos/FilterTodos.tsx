import React from 'react';
import cn from 'classnames';
import { FilterOption } from '../../types/Filter';

type Props = {
  filter: string
  setFilter: (filterStatus: string) => void,
};

export const FilterTodos: React.FC<Props> = ({
  filter,
  setFilter,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filter === 'All',
        })}
        onClick={() => setFilter(FilterOption.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filter === 'Active',
        })}
        onClick={() => setFilter(FilterOption.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === 'Completed',
        })}
        onClick={() => setFilter(FilterOption.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
