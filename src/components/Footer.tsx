import React from 'react';
import { Status } from '../types/Status';
import cn from 'classnames';

interface Props {
  filterStatus: Status;
  setFilter: (value: Status) => void;
  todosCounter: number;
  onClearCompleted: () => Promise<void>;
  showClearCompletedButton: boolean;
}

export const Footer: React.FC<Props> = props => {
  const {
    setFilter,
    filterStatus,
    todosCounter,
    onClearCompleted,
    showClearCompletedButton,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(filter => (
          <a
            key={filter}
            href={`#/${filter === Status.All ? '' : filter.toLowerCase()}`}
            className={cn('filter__link', {
              selected: filterStatus === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => setFilter(filter)}
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
        disabled={!showClearCompletedButton}
      >
        Clear completed
      </button>
    </footer>
  );
};
