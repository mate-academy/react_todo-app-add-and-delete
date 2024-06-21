import React from 'react';
import { Status } from '../types/Status';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  setStatus: (status: Status) => void;
  status: Status;
  todos: Todo[];
};

export const TodoFilter: React.FC<Props> = ({ setStatus, status, todos }) => {
  const isAnyCompletedTodo = todos.some(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === Status.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(Status.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === Status.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(Status.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === Status.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(Status.completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isAnyCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
