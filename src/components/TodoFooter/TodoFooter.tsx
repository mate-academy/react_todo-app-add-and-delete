import React, { Dispatch, SetStateAction } from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import cn from 'classnames';

type Props = {
  activeTodosCount: number;
  setFilter: Dispatch<SetStateAction<FilterStatus>>;
  filter: FilterStatus;
  onClearCompleted: () => Promise<void>;
  completedTodosCount: number;
};

export const TodoFooter: React.FC<Props> = props => {
  const {
    activeTodosCount,
    setFilter,
    filter,
    onClearCompleted,
    completedTodosCount,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(status => (
          <a
            key={status}
            href={`#/${status === FilterStatus.All ? '' : status.toLowerCase()}`}
            className={cn('filter__link', {
              selected: filter === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={completedTodosCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
