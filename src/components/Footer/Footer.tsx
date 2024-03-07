import React from 'react';
import cn from 'classnames';
import { Status } from '../../types/Status';

type Props = {
  itemsLeft: number;
  itemsCompleted: number;
  currentStatus: Status;
  setStatus: (value: Status) => void;
  removeHandleDeleteTodo: () => void;
};

export const Footer: React.FC<Props> = ({
  itemsLeft,
  itemsCompleted,
  currentStatus,
  setStatus,
  removeHandleDeleteTodo,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: currentStatus === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(Status.All)}
        >
          {Status.All}
        </a>

        <a
          href="#/"
          className={cn('filter__link', {
            selected: currentStatus === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(Status.Active)}
        >
          {Status.Active}
        </a>

        <a
          href="#/"
          className={cn('filter__link', {
            selected: currentStatus === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(Status.Completed)}
        >
          {Status.Completed}
        </a>
      </nav>

      {itemsCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={removeHandleDeleteTodo}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
