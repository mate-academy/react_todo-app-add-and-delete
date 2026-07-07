import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../types/FilterType';

type Props = {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
};

export const Filter: React.FC<Props> = ({ filter, onFilterChange }) => {
  const filterLinks = [
    { type: FilterType.All, label: 'All', href: '#/' },
    { type: FilterType.Active, label: 'Active', href: '#/active' },
    { type: FilterType.Completed, label: 'Completed', href: '#/completed' },
  ];

  return (
    <nav className="filter" data-cy="Filter">
      {filterLinks.map(({ type, label, href }) => (
        <a
          key={type}
          href={href}
          className={classNames('filter__link', {
            selected: filter === type,
          })}
          data-cy={`FilterLink${label}`}
          onClick={() => onFilterChange(type)}
        >
          {label}
        </a>
      ))}
    </nav>
  );
};
