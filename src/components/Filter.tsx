import React from 'react';
import classNames from 'classnames';
import { Filter as FilterType } from '../types/Filter';

type Props = {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
};

const filters = [
  {
    type: FilterType.All,
    href: '#/',
    label: 'All',
    dataCy: 'FilterLinkAll',
  },
  {
    type: FilterType.Active,
    href: '#/active',
    label: 'Active',
    dataCy: 'FilterLinkActive',
  },
  {
    type: FilterType.Completed,
    href: '#/completed',
    label: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const Filter: React.FC<Props> = ({ filter, onFilterChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(({ type, href, label, dataCy }) => (
        <a
          key={type}
          href={href}
          className={classNames('filter__link', {
            selected: filter === type,
          })}
          data-cy={dataCy}
          onClick={() => onFilterChange(type)}
        >
          {label}
        </a>
      ))}
    </nav>
  );
};
