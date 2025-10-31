import React from 'react';
import cn from 'classnames';

export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

const FILTERS: FilterStatus[] = [
  FilterStatus.All,
  FilterStatus.Active,
  FilterStatus.Completed,
];

type FilterProps = {
  value: FilterStatus;
  onChange: (nextStatus: FilterStatus) => void;
};

export const Filter: React.FC<FilterProps> = ({ value, onChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {FILTERS.map(filter => (
        <a
          key={filter}
          href={`#/${filter === FilterStatus.All ? '' : filter}`}
          className={cn('filter__link', {
            selected: value === filter,
          })}
          data-cy={`FilterLink${filter[0].toUpperCase() + filter.slice(1)}`}
          onClick={event => {
            event.preventDefault();
            onChange(filter);
          }}
        >
          {filter[0].toUpperCase() + filter.slice(1)}
        </a>
      ))}
    </nav>
  );
};
