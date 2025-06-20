import React, { useState } from 'react';

interface TodosFooterProps {
  completedItems: number;
  totalItems: number;
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  onClearCompleted: () => void;
}

export const TodosFooter: React.FC<TodosFooterProps> = ({
  completedItems,
  totalItems,
  onFilterChange,
  onClearCompleted,
}) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterChange = (filter: 'all' | 'active' | 'completed') => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${totalItems - completedItems} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${activeFilter === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => handleFilterChange('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${activeFilter === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => handleFilterChange('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${activeFilter === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilterChange('completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => onClearCompleted()}
        disabled={completedItems === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
