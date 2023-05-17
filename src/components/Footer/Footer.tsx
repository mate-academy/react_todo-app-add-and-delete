import React from 'react';
import { Filter } from '../Filter/Filter';
import { FilterStatus } from '../../types/FilterStatus';

interface Props {
  hasCompletedTodos: boolean;
  activeTodosCount: number;
  filter: FilterStatus;
  onChangeFilter: (filter: FilterStatus) => void;
  onDeleteCompletedTodos: () => void;
}

export const Footer: React.FC<Props> = ({
  hasCompletedTodos,
  activeTodosCount,
  filter,
  onChangeFilter,
  onDeleteCompletedTodos,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${activeTodosCount} items left`}
    </span>

    <Filter filter={filter} onChangeFilter={onChangeFilter} />

    {hasCompletedTodos && (
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onDeleteCompletedTodos}
      >
        Clear completed
      </button>
    )}
  </footer>
);
