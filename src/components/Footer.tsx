import React from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';

type Props = {
  onFilterStatus: (status: Status) => void,
  todosFilterStatus: Status,
  onDeleteCompleated: () => void,
  hasCompleted: boolean;
  activeTodosCount: number;
};

export const Footer: React.FC<Props> = ({
  onFilterStatus,
  todosFilterStatus,
  onDeleteCompleated,
  hasCompleted,
  activeTodosCount,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: todosFilterStatus === Status.All,
          })}
          onClick={(event) => {
            event.preventDefault();
            onFilterStatus(Status.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={classNames('filter__link', {
            selected: todosFilterStatus === Status.Active,
          })}
          onClick={(event) => {
            event.preventDefault();
            onFilterStatus(Status.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={classNames('filter__link', {
            selected: todosFilterStatus === Status.Completed,
          })}
          onClick={(event) => {
            event.preventDefault();
            onFilterStatus(Status.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => onDeleteCompleated()}
        disabled={!hasCompleted}
        hidden={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
