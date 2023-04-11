import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Status } from '../enums/Status';

interface Props {
  todos: Todo[],
  changeStatus: (newStatus: Status) => void,
  selectedStatus: Status,
  onDeleteCompletedTodos: () => void,
}

export const Footer: React.FC<Props> = ({
  todos,
  changeStatus,
  selectedStatus,
  onDeleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === Status.All },
          )}
          onClick={() => changeStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === Status.Active },
          )}
          onClick={() => changeStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === Status.Completed },
          )}
          onClick={() => changeStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onDeleteCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
