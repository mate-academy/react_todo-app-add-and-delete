import React, { useContext } from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';
import { TodoContext } from '../context/TodoContext';

export const TodoFilter: React.FC = () => {
  const { filter, filterChange } = useContext(TodoContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === Status.all,
        })}
        data-cy="FilterLinkAll"
        onClick={() => filterChange(Status.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === Status.active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => filterChange(Status.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === Status.completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => filterChange(Status.completed)}
      >
        Completed
      </a>
    </nav>
  );
};
