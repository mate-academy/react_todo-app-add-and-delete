import React from 'react';
import { Filter } from '../types/Filter';
import { TodoFilter } from './TodoFilter';

type Props = {
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  isClearingCompleted: boolean;
  selectedFilter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  hasCompletedTodos,
  isClearingCompleted,
  selectedFilter,
  onFilterChange,
  onClearCompleted,
}) => {
  const itemWord = activeTodosCount === 1 ? 'item' : 'items';

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} {itemWord} left
      </span>

      <TodoFilter
        selectedFilter={selectedFilter}
        onFilterChange={onFilterChange}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos || isClearingCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
