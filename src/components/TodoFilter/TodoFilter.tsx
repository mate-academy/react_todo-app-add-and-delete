import React from 'react';
import cn from 'classnames';

import { FilterType } from '../../types/FilterType';

type Props = {
  filter: FilterType;
  handleFilter: (filter: FilterType) => void;
};

const filters = [
  { type: FilterType.All, label: 'All', href: '#/' },
  { type: FilterType.Active, label: 'Active', href: '#/active' },
  { type: FilterType.Completed, label: 'Completed', href: '#/completed' },
];

export const TodoFilter: React.FC<Props> = ({ filter, handleFilter }) => {
  const getFilterClassName = (currentFilter: FilterType) =>
    cn('filter__link', { selected: filter === currentFilter });

  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(({ type, label, href }) => (
        <a
          key={type}
          href={href}
          className={getFilterClassName(type)}
          data-cy={`FilterLink${type}`}
          onClick={() => handleFilter(type)}
        >
          {label}
        </a>
      ))}
    </nav>
  );
};
