import React from 'react';
import classNames from 'classnames';
import { StatusFilter } from '../../types/StatusFilter';

type Props = {
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
  clearCompleted: () => Promise<void>;
  countActiveTodos: number;
  hasCompletedTodos: boolean;
};

export const TodoFooter: React.FC<Props> = ({
  setStatusFilter,
  statusFilter,
  countActiveTodos,
  hasCompletedTodos,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countActiveTodos} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.keys(StatusFilter).map(status => (
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: statusFilter === status,
            })}
            data-cy={`FilterLink${status}`}
            key={status}
            onClick={() => setStatusFilter(status as StatusFilter)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
