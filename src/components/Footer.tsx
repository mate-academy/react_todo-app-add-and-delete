import React from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

type Props = {
  filterStatus: Status;
  setFilterStatus: (value: Status) => void;
  todos: Todo[];
  setTodos: (value: Todo[]) => void;
};

export const Footer: React.FC<Props> = ({
  filterStatus,
  setFilterStatus,
  todos,
  setTodos,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed).length;

  const handleClearTodo = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos === 1 ? '1 item left' : `${activeTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterStatus === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterStatus === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterStatus === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearTodo}
        disabled={!!activeTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
