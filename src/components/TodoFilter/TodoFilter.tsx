import React from 'react';
import cn from 'classnames';
import { TodoStatusFilter } from '../../types/TodoStatusFilter';

interface Props {
  statusFilter: TodoStatusFilter;
  changeStatusFilter: (status: TodoStatusFilter) => void;
}

export const TodoFilter: React.FC<Props> = ({
  statusFilter,
  changeStatusFilter,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn(
          'filter__link',
          { selected: statusFilter === TodoStatusFilter.All },
        )}
        onClick={() => changeStatusFilter(TodoStatusFilter.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn(
          'filter__link',
          { selected: statusFilter === TodoStatusFilter.Active },
        )}
        onClick={() => changeStatusFilter(TodoStatusFilter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn(
          'filter__link',
          { selected: statusFilter === TodoStatusFilter.Completed },
        )}
        onClick={() => changeStatusFilter(TodoStatusFilter.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
