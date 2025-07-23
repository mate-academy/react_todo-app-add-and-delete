import React from 'react';
import { Todo } from '../types/Todo';
import { FilterOption } from '../types/FilterOption';

interface FooterProps {
  todos: Todo[];
  filter: FilterOption;
  onFilterChange: (option: FilterOption) => void;
  activeCount: number;
  completedCount: number;
  onClear: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  filter,
  onFilterChange,
  activeCount,
  completedCount,
  onClear,
}) => {
  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {activeCount} items left
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={`filter__link ${filter === 'All' ? 'selected' : ''}`}
              data-cy="FilterLinkAll"
              onClick={e => {
                e.preventDefault();
                onFilterChange('All');
              }}
            >
              All
            </a>

            <a
              href="#/active"
              className={`filter__link ${filter === 'Active' ? 'selected' : ''}`}
              data-cy="FilterLinkActive"
              onClick={e => {
                e.preventDefault();
                onFilterChange('Active');
              }}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={`filter__link ${filter === 'Completed' ? 'selected' : ''}`}
              data-cy="FilterLinkCompleted"
              onClick={e => {
                e.preventDefault();
                onFilterChange('Completed');
              }}
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={completedCount === 0}
            onClick={onClear}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
