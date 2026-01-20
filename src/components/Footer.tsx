import React from 'react';
import { Filter, FilterType } from './Filter';

interface Props {
  activeCount: number;
  completedCount: number;
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  activeCount,
  completedCount,
  selectedFilter,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </span>

      <Filter selectedFilter={selectedFilter} onFilterChange={onFilterChange} />

      <button
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
        type="button"
      >
        Clear completed
      </button>
    </footer>
  );
};
