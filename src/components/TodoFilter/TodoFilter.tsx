import React from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  filterField: Filter;
  setFilterField: (filterField: Filter) => void;
};

const filters = [
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

export const TodoFilter: React.FC<Props> = ({
  filterField,
  setFilterField,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(({ label, value, href, dataCy }) => {
        return (
          <a
            key={value}
            href={href}
            className={cn('filter__link', {
              selected: filterField === value,
            })}
            data-cy={dataCy}
            onClick={() => setFilterField(value)}
          >
            {label}
          </a>
        );
      })}
    </nav>
  );
};
