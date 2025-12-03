// src/components/TodoFooter.tsx
import React from 'react';
import { FilterType, FILTERS } from '../constants/filters';

interface TodoFooterProps {
  activeTodosCount: number;
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  hasCompletedTodos: boolean;
  onClearCompleted: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  activeTodosCount,
  filter,
  setFilter,
  hasCompletedTodos,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
      </span>

      <nav className="filters" data-cy="Filter">
        {Object.values(FILTERS).map(f => (
          <a
            key={f}
            href="#/"
            className={`filter__link ${filter === f ? 'selected' : ''}`}
            onClick={() => setFilter(f)}
            data-cy={`FilterLink${f[0].toUpperCase() + f.slice(1)}`}
          >
            {f}
          </a>
        ))}
      </nav>

      {/* Clear Completed button */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
