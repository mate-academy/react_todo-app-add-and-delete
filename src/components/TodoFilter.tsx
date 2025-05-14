import React from 'react';

interface TodoFilterProps {
  filter: string;
  setFilter: (filter: string) => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  filter,
  setFilter,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
        data-cy="FilterLinkAll"
        onClick={e => {
          e.preventDefault();
          setFilter('all');
        }}
      >
        All
      </a>
      <a
        href="#/active"
        className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
        data-cy="FilterLinkActive"
        onClick={e => {
          e.preventDefault();
          setFilter('active');
        }}
      >
        Active
      </a>
      <a
        href="#/completed"
        className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
        data-cy="FilterLinkCompleted"
        onClick={e => {
          e.preventDefault();
          setFilter('completed');
        }}
      >
        Completed
      </a>
    </nav>
  );
};
