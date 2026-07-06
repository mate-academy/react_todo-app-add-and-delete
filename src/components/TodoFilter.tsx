import React from 'react';
import { FilterStatus } from '../types/FilterStatus';
type Props = {
  filter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
};
export const TodoFilter = ({ filter, onFilterChange }: Props) => (
  <nav className="filter" data-cy="Filter">
    {Object.values(FilterStatus).map(status => {
      const capitalized = status[0].toUpperCase() + status.slice(1);

      return (
        <a
          key={status}
          onClick={() => onFilterChange(status)}
          href={status === FilterStatus.All ? '#/' : `#/${status}`}
          className={
            filter === status ? 'filter__link selected' : 'filter__link'
          }
          data-cy={`FilterLink${capitalized}`}
        >
          {capitalized}
        </a>
      );
    })}
  </nav>
);
