import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  status: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
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
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: status === 'all',
        })}
        data-cy="FilterLinkAll"
        onClick={() => onStatusChange('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: status === 'active',
        })}
        data-cy="FilterLinkActive"
        onClick={() => onStatusChange('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: status === 'completed',
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onStatusChange('completed')}
      >
        Completed
      </a>
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
