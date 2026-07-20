import React from 'react';
import { Filter } from '../types/Filter';

type Props = {
  selectedFilter: Filter;
  onFilterChange: (filter: Filter) => void;
};

type FilterOption = {
  value: Filter;
  label: string;
  href: string;
  dataCy: string;
};

const filterOptions: FilterOption[] = [
  {
    value: 'all',
    label: 'All',
    href: '#/',
    dataCy: 'FilterLinkAll',
  },
  {
    value: 'active',
    label: 'Active',
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    value: 'completed',
    label: 'Completed',
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFilter: React.FC<Props> = ({
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {filterOptions.map(option => (
        <a
          key={option.value}
          href={option.href}
          className={[
            'filter__link',
            selectedFilter === option.value ? 'selected' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          data-cy={option.dataCy}
          onClick={() => onFilterChange(option.value)}
        >
          {option.label}
        </a>
      ))}
    </nav>
  );
};
