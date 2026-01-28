import React from 'react';
import { TodoFilter } from '../types/Todo';

interface TodoFooterProps {
  activeCount: number;
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  onClearCompleted: () => void;
  hasCompleted: boolean;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  activeCount,
  filter,
  onFilterChange,
  onClearCompleted,
  hasCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span
      className="todo-count"
      data-cy="TodosCounter"
    >{`${activeCount} items left`}</span>

    <nav className="filter" data-cy="Filter">
      {Object.values(TodoFilter).map(f => (
        <a
          key={f}
          href="#/"
          className={`filter__link ${filter === f ? 'selected' : ''}`}
          onClick={e => {
            e.preventDefault();
            onFilterChange(f as TodoFilter);
          }}
          data-cy={`FilterLink${f[0].toUpperCase() + f.slice(1)}`}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </a>
      ))}
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
