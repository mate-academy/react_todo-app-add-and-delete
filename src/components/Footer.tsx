import React from 'react';
import { FilterStatus } from '../types/FilterStatus';
import { Todo } from '../types/Todo';

interface FooterProps {
  counter: number;
  statusFilter: FilterStatus;
  setStatusFilter: (filter: FilterStatus) => void;
  filteredTodos: Todo[];
  clearCompletedTodos: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  counter,
  statusFilter,
  setStatusFilter,
  filteredTodos,
  clearCompletedTodos,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {counter} items left
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${statusFilter === FilterStatus.All ? 'selected' : ''}`}
        data-cy="FilterLinkAll"
        onClick={() => setStatusFilter(FilterStatus.All)} // Використовуємо FilterStatus
      >
        All
      </a>

      <a
        href="#/active"
        className={`filter__link ${statusFilter === FilterStatus.Active ? 'selected' : ''}`}
        data-cy="FilterLinkActive"
        onClick={() => setStatusFilter(FilterStatus.Active)} // Використовуємо FilterStatus
      >
        Active
      </a>

      <a
        href="#/completed"
        className={`filter__link ${statusFilter === FilterStatus.Completed ? 'selected' : ''}`}
        data-cy="FilterLinkCompleted"
        onClick={() => setStatusFilter(FilterStatus.Completed)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={filteredTodos.filter(todo => todo.completed).length === 0}
      onClick={clearCompletedTodos}
    >
      Clear completed
    </button>
  </footer>
);
