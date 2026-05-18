import React from 'react';
import cn from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  todos: { completed: boolean }[];
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(status => {
          const label = status[0].toUpperCase() + status.slice(1);
          const href = status === FilterStatus.All ? '#/' : `#/${status}`;

          return (
            <a
              key={status}
              href={href}
              className={cn('filter__link', {
                selected: filter === status,
              })}
              data-cy={`FilterLink${label}`}
              onClick={() => onFilterChange(status)}
            >
              {label}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
