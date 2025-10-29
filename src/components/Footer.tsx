import React from 'react';
import { Filter } from './Filter';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  activeTodosCount: number;
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  onClearCompleted: () => void;
  hasCompletedTodos: boolean;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  currentFilter,
  onFilterChange,
  onClearCompleted,
  hasCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
      </span>

      <Filter currentFilter={currentFilter} onFilterChange={onFilterChange} />

      {hasCompletedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
