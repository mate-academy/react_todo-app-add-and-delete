import React from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';

type Props = {
  itemsLeft: number,
  filterByStatus: string,
  setFilterByStatus: React.Dispatch<React.SetStateAction<Status>>,
  areTodosCompleted: boolean,
  clearCompleted: () => void,
};

export const TodoAppFooter: React.FC<Props> = ({
  itemsLeft,
  filterByStatus,
  setFilterByStatus,
  areTodosCompleted,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterByStatus === Status.All },
          )}
          onClick={() => setFilterByStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterByStatus === Status.Active },
          )}
          onClick={() => setFilterByStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterByStatus === Status.Completed },
          )}
          onClick={() => setFilterByStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: areTodosCompleted ? 'visible' : 'hidden' }}
        onClick={() => clearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
