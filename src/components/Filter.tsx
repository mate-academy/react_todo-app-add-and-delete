// src/components/Filter.tsx
import React from 'react';

interface Props {
  currentFilter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

export const Filter: React.FC<Props> = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(({ label, value }) => (
        <a
          key={value}
          href={`#/${value}`}
          className={`filter__link ${currentFilter === value ? 'selected' : ''}`}
          data-cy={`FilterLink${label}`}
          onClick={e => {
            e.preventDefault();
            onFilterChange(value as 'all' | 'active' | 'completed');
          }}
        >
          {label}
        </a>
      ))}
    </nav>
  );
};
