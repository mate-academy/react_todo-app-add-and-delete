import React from 'react';
import { TodoStatus } from '../../types/TodoStatus';
import classNames from 'classnames';

type TodosFilterProps = {
  filter: TodoStatus;
  setFilter: (filter: TodoStatus) => void;
};

export const TodosFilter: React.FC<TodosFilterProps> = ({
  filter,
  setFilter,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === TodoStatus.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setFilter(TodoStatus.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === TodoStatus.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setFilter(TodoStatus.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === TodoStatus.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilter(TodoStatus.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
