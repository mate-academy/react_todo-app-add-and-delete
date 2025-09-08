import React from 'react';

interface FooterProps {
  activeTodosCount: number;
  filterByStatus: 'all' | 'active' | 'completed';
  setFilterByStatus: (filter: 'all' | 'active' | 'completed') => void;
  clearTodos: () => void;
  completedTodosCount: number;
}

export const Footer: React.FC<FooterProps> = ({
  activeTodosCount,
  filterByStatus,
  setFilterByStatus,
  clearTodos,
  completedTodosCount,
}) => {
  const hasCompletedTodos = completedTodosCount > 0;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filterByStatus === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilterByStatus('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filterByStatus === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilterByStatus('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filterByStatus === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterByStatus('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearTodos}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};