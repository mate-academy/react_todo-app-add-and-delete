import React, { memo } from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import { TodoFilter } from '../TodoFilter';

interface FooterProps {
  hasSomeCompletedTodos: boolean;
  count: number;
  statusFilter: FilterStatus;
  onFilter: (filterBy: FilterStatus) => void;
  onClearCompletedTodos: () => void;
}

export const Footer: React.FC<FooterProps> = memo(({
  hasSomeCompletedTodos,
  count,
  statusFilter,
  onFilter,
  onClearCompletedTodos,
}) => {
  const handleClearCompletedTodos = () => {
    onClearCompletedTodos();
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${count} items left`}
      </span>

      <TodoFilter
        statusFilter={statusFilter}
        onFilter={onFilter}
      />

      {hasSomeCompletedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearCompletedTodos}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
});
