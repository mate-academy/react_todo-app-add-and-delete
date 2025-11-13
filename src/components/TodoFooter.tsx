import React from 'react';
import { FilterStatus } from '../types/FilterStatus';
import { Filter } from './Filter';

interface TodoFooterProps {
  incompletedTodosCount: number;
  completedTodosCount: number;
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  onClearCompleted: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  incompletedTodosCount,
  completedTodosCount,
  currentFilter,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {incompletedTodosCount} items left
      </span>
      <Filter currentFilter={currentFilter} onFilterChange={onFilterChange} />
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
