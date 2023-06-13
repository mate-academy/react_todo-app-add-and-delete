import React from 'react';
import { TodoFilter } from '../TodoFilter';
import { TodoStatusFilter } from '../../types/TodoStatusFilter';

interface Props {
  statusFilter: TodoStatusFilter;
  changeStatusFilter: (status: TodoStatusFilter) => void;
  clearCompleted: () => void;
  activeTodosLeft: number;
  isVisible: boolean;
}

export const TodoFooter: React.FC<Props> = ({
  statusFilter,
  changeStatusFilter,
  clearCompleted,
  activeTodosLeft,
  isVisible,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosLeft} items left`}
      </span>

      <TodoFilter
        statusFilter={statusFilter}
        changeStatusFilter={changeStatusFilter}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!isVisible}
        onClick={() => clearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
