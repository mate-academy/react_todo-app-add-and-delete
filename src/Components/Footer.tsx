import React from 'react';
import { Status } from '../types/Todo';

interface Props {
  todosCount: number;
  completedTodosCount: number;
  onClearCompleted: () => void;
  handleFilterChange: (newFilter: Status) => void;
  filter: Status;
}

export const Footer: React.FC<Props> = ({
  todosCount,
  completedTodosCount,
  onClearCompleted,
  handleFilterChange,
  filter,
}) => {
  const activeTodosCounter = todosCount - completedTodosCount;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCounter === 1
          ? '1 item left'
          : `${activeTodosCounter} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => handleFilterChange('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
          onClick={() => handleFilterChange('active')}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
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
        onClick={onClearCompleted}
        disabled={completedTodosCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
