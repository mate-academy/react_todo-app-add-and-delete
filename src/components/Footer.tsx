import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Status } from '../App';

type Props = {
  activeTodos: Todo[];
  completedTodos: Todo[];
  status: Status;
  setStatus: (v: Status) => void;
  clearCompleted: () => void;
  handleSetDelete: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  completedTodos,
  status,
  setStatus,
  clearCompleted,
  handleSetDelete,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodos.length} items left
    </span>

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

    <button
      type="button"
      className="todoapp__clear-completed"
      disabled={!(completedTodos.length > 0)}
      data-cy="ClearCompletedButton"
      onClick={() => {
        handleSetDelete();
        clearCompleted();
      }}
    >
      Clear completed
    </button>
  </footer>
);
