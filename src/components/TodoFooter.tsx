import React from 'react';
import { TodoFooterProps, FilterType } from '../types/TodoFooter';

export const TodoFooter: React.FC<TodoFooterProps> = ({
  uncompletedCount,
  handleClearCompleted,
  allTodosAreActive,
  todos,
  setCurrentFilter,
  currentFilter,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {uncompletedCount}
      {' '}
      {uncompletedCount === 1 ? 'items' : 'items'}
      {' '}
      left
    </span>
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${
          currentFilter === FilterType.All ? 'selected' : ''
        }`}
        data-cy="FilterLinkAll"
        onClick={() => setCurrentFilter(FilterType.All)}
      >
        All
      </a>
      <a
        href="#/active"
        className={`filter__link ${
          currentFilter === FilterType.Active ? 'selected' : ''
        }`}
        data-cy="FilterLinkActive"
        onClick={() => setCurrentFilter(FilterType.Active)}
      >
        Active
      </a>
      <a
        href="#/completed"
        className={`filter__link ${
          currentFilter === FilterType.Completed ? 'selected' : ''
        }`}
        data-cy="FilterLinkCompleted"
        onClick={() => setCurrentFilter(FilterType.Completed)}
      >
        Completed
      </a>
    </nav>
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={handleClearCompleted}
      disabled={allTodosAreActive || todos.every((todo) => !todo.completed)}
    >
      Clear completed
    </button>
  </footer>
);
