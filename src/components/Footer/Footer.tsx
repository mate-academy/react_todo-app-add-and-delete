import React from 'react';
import cn from 'classnames';
import { StatusFilter } from '../../enums/statusFilter';

type Props = {
  activeTodosCount: number;
  statusFilter: StatusFilter;
  onStatusFilterChange: (statusFilter: StatusFilter) => void;
  isThereAtLeastOneCompletedTodo: boolean;
  onClearCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  statusFilter,
  onStatusFilterChange,
  isThereAtLeastOneCompletedTodo,
  onClearCompletedTodos,
}) => {
  const getHref = (filter: StatusFilter) => {
    switch (filter) {
      case StatusFilter.All:
        return '#/';
      case StatusFilter.Active:
        return '#/active';
      case StatusFilter.Completed:
        return '#/completed';
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(StatusFilter).map(filter => (
          <a
            key={filter}
            href={getHref(filter)}
            className={cn('filter__link', {
              selected: statusFilter === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => onStatusFilterChange(filter)}
          >
            {filter[0] + filter.slice(1).toLowerCase()}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isThereAtLeastOneCompletedTodo}
        onClick={() => onClearCompletedTodos()}
      >
        Clear completed
      </button>
    </footer>
  );
};
