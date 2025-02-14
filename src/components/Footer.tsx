import React from 'react';
import classNames from 'classnames';
import FilterStatus from '../enums/FilterStatus';
import { Todo } from '../types/Todo';

interface FooterProps {
  todos: Todo[];
  filterStatus: FilterStatus;
  setFilterStatus: React.Dispatch<React.SetStateAction<FilterStatus>>;
  onClearCompleted: () => void;
  className?: string;
  'data-cy'?: string;
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  filterStatus,
  setFilterStatus,
  onClearCompleted,
  className,
  'data-cy': dataCy,
}) => {
  const activeTodoCount = todos.filter(todo => !todo.completed).length;

  const filterLinks = Object.values(FilterStatus).map(status => (
    <a
      key={status}
      href={`#/${status}`}
      className={classNames('filter__link', {
        selected: filterStatus === status,
      })}
      data-cy={`FilterLink${status.charAt(0).toUpperCase() + status.slice(1)}`}
      onClick={() => setFilterStatus(status)}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </a>
  ));

  return (
    <footer className={className} data-cy={dataCy}>
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodoCount} item${activeTodoCount !== 1 ? 's' : ''} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
