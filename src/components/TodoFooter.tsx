import React, { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';
import { FilterType } from '../types/FilterType';

type Props = {
  status: FilterType;
  setStatus: Dispatch<SetStateAction<FilterType>>;
  unCompletedTodos?: number;
  completedTodos?: number;
  onClearCompleted: () => Promise<void>;
};

export const TodoFooter: React.FC<Props> = props => {
  const {
    status,
    setStatus,
    unCompletedTodos,
    completedTodos,
    onClearCompleted,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {unCompletedTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(filter => (
          <a
            key={filter}
            href="#/"
            className={cn('filter__link', {
              selected: status === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => setStatus(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={completedTodos === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
