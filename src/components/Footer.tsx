import React from 'react';
import classnames from 'classnames';
import { Status } from '../types/Statuses';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  filter: Status;
  setFilter: (value: Status) => void;
  clearCompleted: () => void,
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  clearCompleted,
}) => {
  const leftTodos = todos.filter((todo) => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        { /* eslint-disable-next-line */ }
        {leftTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classnames('filter__link', {
            selected: filter === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classnames('filter__link', {
            selected: filter === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classnames('filter__link', {
            selected: filter === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
      >
        {hasCompletedTodos && 'Clear completed'}
      </button>
    </footer>
  );
};
