import React from 'react';
import cn from 'classnames';
import { TodoStatus } from '../../constants/TodoStatus';

type TodosFilterProps = {
  filter: TodoStatus;
  onFilterChange: (filter: TodoStatus) => void;
};

export const TodosFilter: React.FC<TodosFilterProps> = ({
  filter,
  onFilterChange,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filter === TodoStatus.All,
        })}
        onClick={() => onFilterChange(TodoStatus.All)}
        data-cy="FilterLinkAll"
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filter === TodoStatus.Active,
        })}
        onClick={() => onFilterChange(TodoStatus.Active)}
        data-cy="FilterLinkActive"
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === TodoStatus.Completed,
        })}
        onClick={() => onFilterChange(TodoStatus.Completed)}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
