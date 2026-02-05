import React from 'react';
import classNames from 'classnames';
import { FILTERS, FilterType } from '../constants/filters';

interface FilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const Filter: React.FC<FilterProps> = ({ filter, onFilterChange }) => {
  const links = [
    { type: FILTERS.all, label: 'All', dataCy: 'FilterLinkAll' },
    { type: FILTERS.active, label: 'Active', dataCy: 'FilterLinkActive' },
    {
      type: FILTERS.completed,
      label: 'Completed',
      dataCy: 'FilterLinkCompleted',
    },
  ];

  return (
    <nav className="filter" data-cy="Filter">
      {links.map(link => (
        <a
          key={link.type}
          href="#/"
          data-cy={link.dataCy}
          className={classNames('filter__link', {
            selected: filter === link.type,
          })}
          onClick={e => {
            e.preventDefault();
            onFilterChange(link.type);
          }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};
