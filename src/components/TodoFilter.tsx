import React from 'react';
import { Filter } from '../types/Filter';

type FilterProps = {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
};

type FilterItem = {
  value: Filter;
  title: string;
  href: string;
  dataCy: string;
};

const filters: FilterItem[] = [
  {
    value: 'all',
    title: 'All',
    href: '#/',
    dataCy: 'FilterLinkAll',
  },
  {
    value: 'active',
    title: 'Active',
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    value: 'completed',
    title: 'Completed',
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFilter = ({ filter, setFilter }: FilterProps) => {
  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(item => (
        <a
          key={item.value}
          href={item.href}
          className={
            filter === item.value ? 'filter__link selected' : 'filter__link'
          }
          data-cy={item.dataCy}
          onClick={() => setFilter(item.value)}
        >
          {item.title}
        </a>
      ))}
    </nav>
  );
};
