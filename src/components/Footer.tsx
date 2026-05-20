import React from 'react';
import classNames from 'classnames';
import { Filters, Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filter: Filter;
  setFilter: (filter: Filter) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  onClearCompleted,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: filter === Filters.All,
          })}
          onClick={() => setFilter(Filters.All)}
        >
          All
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={classNames('filter__link', {
            selected: filter === Filters.Active,
          })}
          onClick={() => setFilter(Filters.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={classNames('filter__link', {
            selected: filter === Filters.Completed,
          })}
          onClick={() => setFilter(Filters.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
