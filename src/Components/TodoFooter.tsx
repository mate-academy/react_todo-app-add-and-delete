import React from 'react';
import cn from 'classnames';
import { Status } from '../types/Status';

type Props = {
  getStatus: (status: Status) => void;
  status: Status;
  activeTodos: number;
  completedTodos: boolean;
  deleteCompleted: () => Promise<void>;
};

export const TodoFooter: React.FC<Props> = React.memo(({
  getStatus,
  status,
  activeTodos,
  completedTodos,
  deleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: status === Status.all,
          })}
          onClick={() => getStatus(Status.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: status === Status.active,
          })}
          onClick={() => getStatus(Status.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: status === Status.completed,
          })}
          onClick={() => getStatus(Status.completed)}
        >
          Completed
        </a>
      </nav>

      {completedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => deleteCompleted()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
