import React from 'react';

export enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  filter: Filter;
  setFilter: (filter: Filter) => void;
};

export const NavFilter: React.FC<Props> = ({ filter, setFilter }) => {
  const filters: { type: Filter; label: string }[] = [
    { type: Filter.All, label: 'All' },
    { type: Filter.Active, label: 'Active' },
    { type: Filter.Completed, label: 'Completed' },
  ];

  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(({ type, label }) => (
        <a
          key={type}
          href={`#/${type}`}
          className={`filter__link ${filter === type ? 'selected' : ''}`}
          data-cy={
            type === Filter.All
              ? 'FilterLinkAll'
              : type === Filter.Active
                ? 'FilterLinkActive'
                : 'FilterLinkCompleted'
          }
          onClick={e => {
            e.preventDefault();
            setFilter(type);
          }}
        >
          {label}
        </a>
      ))}
    </nav>
  );
};
