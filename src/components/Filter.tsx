import React from 'react';
import classNames from 'classnames';

import { FILTERS, FilterType } from '../constants/filter';

type Props = {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
};

const filters = [
  { value: FILTERS.all, label: 'All', href: '#/', dataCy: 'FilterLinkAll' },
  {
    value: FILTERS.active,
    label: 'Active',
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    value: FILTERS.completed,
    label: 'Completed',
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const Filter: React.FC<Props> = ({ currentFilter, onFilterChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(filter => (
        <a
          key={filter.value}
          href={filter.href}
          className={classNames('filter__link', {
            selected: currentFilter === filter.value,
          })}
          data-cy={filter.dataCy}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </a>
      ))}
    </nav>
  );
};
