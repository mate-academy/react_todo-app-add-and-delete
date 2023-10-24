import React from 'react';
import classNames from 'classnames';
import { Status } from '../../types/Status';
import { ToDo } from '../../types/ToDo';

type Props = {
  todos: ToDo[];
  filter: Status;
  setFilter: (filter: Status) => void ;
  clearCompleted: () => void ;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  clearCompleted,
}) => {
  const applyFilter = (value: Status) => () => setFilter(value);

  const itemsLeft = todos.filter(el => !el.completed).length;
  const hasCompletedTodos = todos.some((todo) => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={applyFilter(Status.All)}
        >
          All
        </a>
        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={applyFilter(Status.Active)}
        >
          Active
        </a>
        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={applyFilter(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      {hasCompletedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
