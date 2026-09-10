import React from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';
import { FILTERS } from '../constants/filters';

type Props = {
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  status: Status;
  onStatusChange: (status: Status) => void;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  hasCompletedTodos,
  status,
  onStatusChange,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} items left
    </span>

    <nav className="filter" data-cy="Filter">
      {FILTERS.map(filter => (
        <a
          key={filter.status}
          href={`#/${filter.status === Status.All ? '' : filter.status}`}
          className={classNames('filter__link', {
            selected: status === filter.status,
          })}
          data-cy={filter.dataCy}
          onClick={() => onStatusChange(filter.status)}
        >
          {filter.label}
        </a>
      ))}
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!hasCompletedTodos}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
