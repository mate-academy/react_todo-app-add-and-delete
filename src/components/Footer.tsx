import classNames from 'classnames';
import React from 'react';
import { Status } from '../types/Status';

interface FooterProps {
  filter: Status;
  setFilter: (filter: Status) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  filter,
  setFilter,
  activeCount,
  completedCount,
  onClearCompleted,
}) => {
  const itemCountText = `${activeCount} ${activeCount === 1 ? 'item' : 'items'} left`;

  const handleFilterClick = (status: Status) => {
    setFilter(status);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemCountText}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(status => (
          <a
            key={status}
            href={`#/${status.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: filter === status,
            })}
            data-cy={`FilterLink${status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}`}
            onClick={() => handleFilterClick(status)}
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
