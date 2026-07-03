import React from 'react';

type FilterType = 'all' | 'active' | 'completed';

type Props = {
  taskCounter: number;
  filter: FilterType;
  todosLength: number;
  hasCompletedTodos: boolean;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  taskCounter,
  filter,
  todosLength,
  hasCompletedTodos,
  onFilterChange,
  onClearCompleted,
}) => {
  if (todosLength === 0) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {taskCounter} {taskCounter === 1 ? 'item' : 'items'} left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={e => {
            e.preventDefault();
            onFilterChange('all');
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
            onFilterChange('active');
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
            onFilterChange('completed');
          }}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
