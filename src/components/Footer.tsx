import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { Status } from '../types/StatusType';

type Props = {
  todos: Todo[];
  filterStatus: Status;
  setFilterStatus: (status: Status) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterStatus,
  setFilterStatus,
  onClearCompleted,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <button
          type="button"
          className={classNames('filter__link', {
            selected: filterStatus === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterStatus(Status.All)}
        >
          All
        </button>

        <button
          type="button"
          className={classNames('filter__link', {
            selected: filterStatus === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterStatus(Status.Active)}
        >
          Active
        </button>

        <button
          type="button"
          className={classNames('filter__link', {
            selected: filterStatus === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterStatus(Status.Completed)}
        >
          Completed
        </button>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
