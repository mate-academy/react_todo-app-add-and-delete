import React from 'react';
import { Todo } from '../types/Todo';

interface FooterProps {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  clearCompleted: () => void;
  isAnyLoading: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  filter,
  setFilter,
  clearCompleted,
  isAnyLoading,
}) => (
  <footer
    className={`todoapp__footer ${todos.length === 0 ? 'hidden' : ''}`}
    data-cy="Footer"
  >
    <span className="todo-count" data-cy="TodosCounter">
      {todos.filter(todo => !todo.completed).length} items left
    </span>
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
        onClick={() => setFilter('all')}
        data-cy="FilterLinkAll"
      >
        All
      </a>
      <a
        href="#/active"
        className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
        onClick={() => setFilter('active')}
        data-cy="FilterLinkActive"
      >
        Active
      </a>
      <a
        href="#/completed"
        className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
        onClick={() => setFilter('completed')}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={todos.every(todo => !todo.completed) || isAnyLoading}
      onClick={clearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
