import React, { FC, SetStateAction } from 'react';
import { Status } from '../../types/Status';

export interface IFooter {
  setStatus: React.Dispatch<SetStateAction<Status>>;
  status: Status;
  activeTodoCount: number;
  hasCompletedTodos: boolean;
}

export const Footer: FC<IFooter> = ({
  setStatus,
  status,
  activeTodoCount,
  hasCompletedTodos,
}) => {
  if (activeTodoCount === 0 && !hasCompletedTodos) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodoCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${status === Status.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${status === Status.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${status === Status.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
