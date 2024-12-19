import React from 'react';
import { FilterStatus } from '../types/FilterStatus';
import { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';

type Props = {
  filterStatus: FilterStatus;
  setFilterStatus: Dispatch<SetStateAction<FilterStatus>>;
  todosCount: number;
  isLoading: boolean;
  onClearCompleted: () => void;
  completedTodosCount: number;
};

export const Footer: React.FC<Props> = ({
  filterStatus,
  setFilterStatus,
  todosCount,
  isLoading,
  onClearCompleted,
  completedTodosCount,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(filter => (
          <a
            key={filter}
            href={`#/${filter === FilterStatus.All ? '' : filter}`}
            className={cn('filter__link', {
              selected: filterStatus === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => setFilterStatus(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0 || isLoading}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
