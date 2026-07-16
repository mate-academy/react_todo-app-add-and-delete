import React from 'react';
import { Filter } from '../types/Filter';

type Props = {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
};

const FILTER_LINKS: { type: Filter; label: string; dataCy: string }[] = [
  { type: Filter.All, label: 'All', dataCy: 'FilterLinkAll' },
  { type: Filter.Active, label: 'Active', dataCy: 'FilterLinkActive' },
  { type: Filter.Completed, label: 'Completed', dataCy: 'FilterLinkCompleted' },
];

export const TodoFilter: React.FC<Props> = ({ filter, onFilterChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {FILTER_LINKS.map(({ type, label, dataCy }) => (
        <a
          key={type}
          href={`#/${type === Filter.All ? '' : type}`}
          className={`filter__link ${filter === type ? 'selected' : ''}`}
          data-cy={dataCy}
          onClick={() => onFilterChange(type)}
        >
          {label}
        </a>
      ))}
    </nav>
  );
};
