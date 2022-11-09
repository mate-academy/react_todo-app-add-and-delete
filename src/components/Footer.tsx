import classNames from 'classnames';
import React from 'react';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  setFilter: (value: Filter) => void;
  filter: Filter;
  deleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  todos, filter, setFilter, deleteCompletedTodos,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="todosCounter">
      {`${todos.length} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames('filter__link', {
          selected: filter === Filter.ALL,
        })}
        onClick={() => setFilter(Filter.ALL)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === Filter.ACTIVE,
        })}
        onClick={() => setFilter(Filter.ACTIVE)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === Filter.COMPLETED,
        })}
        onClick={() => setFilter(Filter.COMPLETED)}
      >
        Completed
      </a>
    </nav>

    <button
      data-cy="ClearCompletedButton"
      type="button"
      className="todoapp__clear-completed"
      onClick={() => deleteCompletedTodos}
    >
      Clear completed
    </button>
  </footer>
);
