import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  status: 'all' | 'active' | 'completed';
  onStatusChange: (status: 'all' | 'active' | 'completed') => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  status,
  onStatusChange,
  onClearCompleted,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === 'all',
          })}
          onClick={() => onStatusChange('all')}
          data-cy="FilterLinkAll"
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

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={() => onClearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
