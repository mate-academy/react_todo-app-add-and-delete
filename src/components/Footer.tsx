import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

type Props = {
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>
  activeTodos: Todo[];
  onClear: () => Promise<void>;
};

export const Footer: React.FC<Props> = ({
  status,
  setStatus,
  activeTodos,
  onClear,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: status === Status.All,
            },
          )}
          onClick={() => setStatus(Status.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: status === Status.Active },
          )}
          onClick={() => setStatus(Status.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: status === Status.Completed },
          )}
          onClick={() => setStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
