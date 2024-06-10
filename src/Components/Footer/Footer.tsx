import React from 'react';
import cn from 'classnames';
import { Status } from '../../types/Status';

type Props = {
  status: Status;
  onClick: (status: Status) => void;
  itemsLeft: number;
  clearAllButtonActive: number;
  deleteAllComplete: () => void;
};

export const Footer: React.FC<Props> = ({
  status,
  onClick,
  itemsLeft,
  clearAllButtonActive,
  deleteAllComplete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            'filter__link selected': status === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onClick(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            'filter__link selected': status === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onClick(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            'filter__link selected': status === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onClick(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!clearAllButtonActive}
        onClick={deleteAllComplete}
      >
        Clear completed
      </button>
    </footer>
  );
};
