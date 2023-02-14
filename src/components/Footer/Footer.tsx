import classNames from 'classnames';
import React, { useEffect } from 'react';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  onStatusChange: (status: TodoStatus) => void;
  activeTodos: number;
  status: TodoStatus;
  completedTodos: number;
  onClear: (clear: boolean) => void;
};

export const Footer: React.FC<Props> = React.memo(({
  onStatusChange,
  status,
  activeTodos,
  completedTodos,
  onClear,
}) => {
  useEffect(() => {
    if (!completedTodos) {
      onClear(false);
    }
  }, [completedTodos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link', {
            selected: status === TodoStatus.All,
          })}
          onClick={() => onStatusChange(TodoStatus.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link', {
            selected: status === TodoStatus.Active,
          })}
          onClick={() => onStatusChange(TodoStatus.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === TodoStatus.Completed,
          })}
          onClick={() => onStatusChange(TodoStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!completedTodos}
        onClick={() => onClear(true)}
      >
        Clear completed
      </button>
    </footer>
  );
});
