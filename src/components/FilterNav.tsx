import React from 'react';
import cn from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  filter: Filter;
  setFilter: (filter: Filter) => void;
};

const FILTER_LINKS = [
  { href: '#/', value: Filter.All, text: 'All', cy: 'FilterLinkAll' },
  {
    href: '#/active',
    value: Filter.Active,
    text: 'Active',
    cy: 'FilterLinkActive',
  },
  {
    href: '#/completed',
    value: Filter.Completed,
    text: 'Completed',
    cy: 'FilterLinkCompleted',
  },
];

export const FilterNav: React.FC<Props> = ({ filter, setFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {FILTER_LINKS.map(link => (
        <a
          key={link.value}
          href={link.href}
          className={cn('filter__link', {
            selected: filter === link.value,
          })}
          data-cy={link.cy}
          onClick={() => setFilter(link.value)}
        >
          {link.text}
        </a>
      ))}
    </nav>
  );
};
