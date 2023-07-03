import React, { memo } from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import { TodoFilter } from '../TodoFilter';

interface FooterProps {
  isSomeCompletedTodos: boolean;
  count: number;
  filterStatus: FilterStatus;
  onFilter: (filterBy: FilterStatus) => void;
  onClearCompletedTodos: () => void;
}

export const Footer: React.FC<FooterProps> = memo(({
  isSomeCompletedTodos,
  count,
  filterStatus,
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
        filterStatus={filterStatus}
        onFilter={onFilter}
      />

      {isSomeCompletedTodos && (
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
