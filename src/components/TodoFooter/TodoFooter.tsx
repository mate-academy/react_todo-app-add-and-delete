import React from 'react';
import { FilterStatus } from '../../App';

type TodoFooterProps = {
  activeTodosCount: number;
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  onClearCompleted: () => Promise<void>;
  totalTodos: number;
};

export const TodoFooter: React.FC<TodoFooterProps> = ({
  activeTodosCount,
  filter,
  setFilter,
  onClearCompleted,
  totalTodos,
}) => {
  const hasCompletedTodos = totalTodos - activeTodosCount > 0;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === FilterStatus.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => {
            setFilter(FilterStatus.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === FilterStatus.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => {
            setFilter(FilterStatus.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === FilterStatus.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setFilter(FilterStatus.Completed);
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
