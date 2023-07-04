import React, { memo } from 'react';
import cN from 'classnames';
import { FilterBy } from '../../utils/enums';

type Props = {
  activeTodosNumber: number,
  statusFilter: FilterBy,
  handleFilterChange: (event: React.MouseEvent) => void,
  hasCompleted: boolean,
  clearCompleted: () => void
};

export const TodoFilter: React.FC<Props> = memo(
  ({
    activeTodosNumber,
    statusFilter,
    handleFilterChange,
    hasCompleted,
    clearCompleted,
  }) => (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosNumber} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cN('filter__link', {
            selected: statusFilter === FilterBy.All,
          })}
          onClick={handleFilterChange}
        >
          All
        </a>

        <a
          href="#/active"
          className={cN('filter__link', {
            selected: statusFilter === FilterBy.Active,
          })}
          onClick={handleFilterChange}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cN('filter__link', {
            selected: statusFilter === FilterBy.Completed,
          })}
          onClick={handleFilterChange}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cN('todoapp__clear-completed', {
          'is-invisible': !hasCompleted,
        })}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  ),
);
