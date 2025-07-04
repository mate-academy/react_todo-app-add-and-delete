import cn from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { StatusFilter } from '../../types/TodosStatus';

type Props = {
  todos: Todo[];
  status: 'all' | 'active' | 'completed';
  onStatusChange: (status: StatusFilter) => void;
  onClearCompleted: () => void;
  hasCompleted: boolean;
};

const statusNames: Record<StatusFilter, string> = {
  [StatusFilter.All]: 'All',
  [StatusFilter.Active]: 'Active',
  [StatusFilter.Completed]: 'Completed',
};

export const Footer: React.FC<Props> = ({
  todos,
  status,
  onStatusChange,
  onClearCompleted,
  hasCompleted,
}) => {
  const completedCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${completedCount} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.values(StatusFilter).map(value => (
          <a
            key={value}
            href="#/"
            className={cn('filter__link', { selected: status === value })}
            data-cy={`FilterLink${statusNames[value]}`}
            onClick={() => onStatusChange(value)}
          >
            {statusNames[value]}
          </a>
        ))}
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
