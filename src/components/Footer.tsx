import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
import { StatusTodo } from '../types/StatusTodo';

type Props = {
  activeTodos: Todo[];
  statusTodo: StatusTodo;
  setStatusTodo: (value: StatusTodo) => void;
  hasCompletedTodos: boolean;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  statusTodo,
  setStatusTodo,
  hasCompletedTodos,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: statusTodo === StatusTodo.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStatusTodo(StatusTodo.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: statusTodo === StatusTodo.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStatusTodo(StatusTodo.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: statusTodo === StatusTodo.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatusTodo(StatusTodo.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
