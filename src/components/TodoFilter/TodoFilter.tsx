import React from 'react';
import { Filter } from '../../types/Filter';

type Props = {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
};

const FILTER_LINKS: {
  label: string;
  value: Filter;
  href: string;
  dataCy: string;
}[] = [
  { label: 'All', value: Filter.All, href: '#/', dataCy: 'FilterLinkAll' },
  {
    label: 'Active',
    value: Filter.Active,
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    label: 'Completed',
    value: Filter.Completed,
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFilter: React.FC<Props> = ({ filter, onFilterChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {FILTER_LINKS.map(({ label, value, href, dataCy }) => (
        <a
          key={value}
          href={href}
          className={`filter__link${filter === value ? ' selected' : ''}`}
          data-cy={dataCy}
          onClick={() => onFilterChange(value)}
        >
          {label}
        </a>
      ))}
    </nav>
  );
};
