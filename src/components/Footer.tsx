import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/SortTypes';
import React from 'react';

type Props = {
  onClick: (status: TodoStatus) => void;
  status: string;
  leftItems: number;
  completedItems: Todo[];
  onDelete: () => void;
};

const FILTER_TITLES = {
  [TodoStatus.All]: 'All',
  [TodoStatus.Active]: 'Active',
  [TodoStatus.Completed]: 'Completed',
};

export const Footer: React.FC<Props> = ({
  onClick,
  status,
  leftItems,
  completedItems,
  onDelete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {leftItems} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodoStatus).map(filterStatus => (
          <a
            key={filterStatus}
            href={`#/${filterStatus.toLowerCase()}`}
            className={cn('filter__link', {
              selected: status === filterStatus,
            })}
            data-cy={`FilterLink${FILTER_TITLES[filterStatus]}`}
            onClick={() => onClick(filterStatus)}
          >
            {FILTER_TITLES[filterStatus]}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedItems.length === 0}
        onClick={onDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
