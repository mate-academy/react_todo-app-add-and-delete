import React from 'react';

export enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  filter: Filter;
};

const filters = [
  {
    title: 'All',
    value: Filter.All,
    href: '#/',
    dataCy: 'FilterLinkAll',
  },
  {
    title: 'Active',
    value: Filter.Active,
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    title: 'Completed',
    value: Filter.Completed,
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFilter: React.FC<Props> = ({ filter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(item => (
        <a
          key={item.value}
          href={item.href}
          className={`filter__link ${filter === item.value ? 'selected' : ''}`}
          data-cy={item.dataCy}
        >
          {item.title}
        </a>
      ))}
    </nav>
  );
};
