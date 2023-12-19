import classNames from 'classnames';
import React from 'react';
import { Status } from '../../types/Status';

type Props = {
  onStatus: (status: Status) => void;
  status: Status;
  completedCount: number;
  isClearNeeded: boolean;
  handleClear: () => void;
};

export const Footer: React.FC<Props> = ({
  onStatus,
  status,
  completedCount,
  handleClear,
  isClearNeeded,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${completedCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === Status.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onStatus(Status.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === Status.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onStatus(Status.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === Status.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onStatus(Status.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClear}
        disabled={isClearNeeded}
      >
        Clear completed
      </button>
    </footer>
  );
};
