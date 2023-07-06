import React from 'react';
import { Filters } from './types/Filters';

interface Props {
  setFilter: (filter: Filters) => void;
  filter: Filters;
}

export const Filter: React.FC<Props> = ({ filter, setFilter }) => {
  const linkData = [
    { label: 'All', value: Filters.ALL },
    { label: 'Active', value: Filters.ACTIVE },
    { label: 'Completed', value: Filters.COMPLETED },
  ];

  return (
    <nav className="filter">
      {linkData.map((link) => (
        <a
          key={link.value}
          href={`#/${link.value}`}
          className={`filter__link ${filter === link.value ? 'selected' : ''}`}
          onClick={() => setFilter(link.value)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};
