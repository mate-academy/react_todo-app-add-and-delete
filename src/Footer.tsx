import React from 'react';
import classNames from 'classnames';
import { Status } from './types/status';
import { Todo } from './types/Todo';

interface FooterProps {
  todosByStatus: (query?: Status) => Todo[];
  queryStatus: string;
  setQueryStatus: (status: Status) => void;
  hasCompletedTodos: () => boolean;
  deleteTodo: (id: number) => void;
}

export const Footer: React.FC<FooterProps> = ({
  todosByStatus,
  queryStatus,
  setQueryStatus,
  hasCompletedTodos,
  deleteTodo,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosByStatus(Status.active).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: queryStatus === Status.all,
          })}
          onClick={() => setQueryStatus(Status.all)}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: queryStatus === Status.active,
          })}
          onClick={() => setQueryStatus(Status.active)}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: queryStatus === Status.completed,
          })}
          onClick={() => setQueryStatus(Status.completed)}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!hasCompletedTodos()}
        onClick={() => {
          todosByStatus(Status.completed).forEach(todo => deleteTodo(todo.id));
        }}
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
