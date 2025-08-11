import React from 'react';
import { Todo } from '../types/Todo';

type FilterStatus = 'all' | 'active' | 'completed';

interface FooterProps {
  todos: Todo[];
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;

  loadingTodoIds: number[];
  handleClearCompleted: () => Promise<void>;
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  filterStatus,
  setFilterStatus,
  loadingTodoIds,
  handleClearCompleted,
}) => {
  const activeTodosCount = todos.filter(
    todo => !todo.completed && !loadingTodoIds.includes(todo.id),
  ).length;

  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filterStatus === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilterStatus('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filterStatus === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilterStatus('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filterStatus === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterStatus('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!hasCompletedTodos || loadingTodoIds.length > 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
