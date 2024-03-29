import classNames from 'classnames';
import { Status } from '../types/status';
import { Todo } from '../types/Todo';
import React from 'react';

type Props = {
  todos: Todo[];
  handleDelete: (id: number) => void;
  handleChangeStatus: (
    status: Status,
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => void;
  filterStatus: Status;
};

export const Footer: React.FC<Props> = ({
  handleDelete,
  handleChangeStatus,
  filterStatus,
  todos,
}) => {
  const clearCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => handleDelete(todo.id));
  };

  const itemsActive = () => {
    return todos.filter(todo => !todo.completed).length;
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsActive()} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterStatus === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={e => handleChangeStatus(Status.All, e)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterStatus === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={e => handleChangeStatus(Status.Active, e)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterStatus === Status.Completed,
          })}
          onClick={e => handleChangeStatus(Status.Completed, e)}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={todos.every(todo => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
