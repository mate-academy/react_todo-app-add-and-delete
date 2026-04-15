import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../../App';

interface FooterProps {
  uncompletedTodosCount: number;
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
  handleDeleteClearCompleted: () => void;
  completedTodosCount: number;
}

export const Footer: React.FC<FooterProps> = ({
  uncompletedTodosCount,
  filterStatus,
  setFilterStatus,
  handleDeleteClearCompleted,
  completedTodosCount,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(status => (
          <a
            key={status}
            href={`#/${status === FilterStatus.All ? '' : status}`}
            className={classNames('filter__link', {
              selected: filterStatus === status,
            })}
            data-cy={`FilterLink${status.charAt(0).toUpperCase() + status.slice(1)}`}
            onClick={() => setFilterStatus(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          hidden: completedTodosCount === 0,
        })}
        data-cy="ClearCompletedButton"
        onClick={handleDeleteClearCompleted}
        disabled={completedTodosCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
