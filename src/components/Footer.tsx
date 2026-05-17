import React from 'react';
import { Todo } from '../types/Todo';

type FilterValue = 'all' | 'active' | 'completed';

type Props = {
  filter: FilterValue;
  hasCompleted: boolean;
  loading: boolean;
  onClearCompleted: () => void;
  setFilter: (value: FilterValue) => void;
  todos: Todo[];
};

export const Footer: React.FC<Props> = ({
  filter,
  hasCompleted,
  loading,
  onClearCompleted,
  setFilter,
  todos,
}) => {
  if (todos.length === 0 || loading) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
