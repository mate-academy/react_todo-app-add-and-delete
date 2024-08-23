import classNames from 'classnames';
import React from 'react';
import { FilterStatusType, Todo } from '../types/Todo';

type Props = {
  setFilterBy: (filter: FilterStatusType) => void;
  todos: Todo[];
  filterBy: FilterStatusType;
};

export const Footer: React.FC<Props> = ({ setFilterBy, todos, filterBy }) => {
  const leftTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTaskCount = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {leftTodosCount} items left
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === FilterStatusType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterBy(FilterStatusType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterBy === FilterStatusType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterBy(FilterStatusType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterBy === FilterStatusType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterBy(FilterStatusType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTaskCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
