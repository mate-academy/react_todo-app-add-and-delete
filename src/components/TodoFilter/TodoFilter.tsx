import React from 'react';
import cn from 'classnames';

import { TodoStatusFilter } from '../../types/TodoStatusFilter';

type Props = {
  status: TodoStatusFilter,
  onSelectStatusFilter: (status: TodoStatusFilter) => void
};

export const TodoFilter: React.FC<Props> = ({
  status,
  onSelectStatusFilter,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link',
          { selected: status === TodoStatusFilter.All })}
        onClick={() => onSelectStatusFilter(TodoStatusFilter.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link',
          { selected: status === TodoStatusFilter.Active })}
        onClick={() => onSelectStatusFilter(TodoStatusFilter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link',
          { selected: status === TodoStatusFilter.Completed })}
        onClick={() => onSelectStatusFilter(TodoStatusFilter.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
