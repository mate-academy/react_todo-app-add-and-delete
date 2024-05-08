import React from 'react';

interface FilterProps {
  selectedFilter: 'all' | 'active' | 'completed';
  onSelectFilter: (selected: 'all' | 'active' | 'completed') => void;
}

const Filter: React.FC<FilterProps> = ({ selectedFilter, onSelectFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${selectedFilter === 'all' ? 'selected' : ''}`}
        data-cy="FilterLinkAll"
        onClick={() => onSelectFilter('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={`filter__link ${selectedFilter === 'active' ? 'selected' : ''}`}
        data-cy="FilterLinkActive"
        onClick={() => onSelectFilter('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={`filter__link ${selectedFilter === 'completed' ? 'selected' : ''}`}
        data-cy="FilterLinkCompleted"
        onClick={() => onSelectFilter('completed')}
      >
        Completed
      </a>
    </nav>
  );
};

export default Filter;
