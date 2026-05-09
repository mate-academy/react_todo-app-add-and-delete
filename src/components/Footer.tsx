import React from 'react';
import classNames from 'classnames';

import { TodoContext } from './TodoContext';
import {
  Filter,
  FILTER_ACTIVE,
  FILTER_ALL,
  FILTER_COMPLETED,
} from '../types/Filter';

type FooterProps = {};
export const Footer: React.FC<FooterProps> = () => {
  const { todos, filter, setFilter, clearCompletedTodos } =
    React.useContext(TodoContext)!;
  const handleFilterChange = (
    event: React.MouseEvent<HTMLAnchorElement>,
    newFilter: Filter,
  ) => {
    event.preventDefault();
    setFilter(newFilter);
  };

  const clearCompleted = async () => {
    clearCompletedTodos();
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed && !todo.loading).length} items
        left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === FILTER_ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={e => handleFilterChange(e, FILTER_ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === FILTER_ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={e => handleFilterChange(e, FILTER_ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === FILTER_COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={e => handleFilterChange(e, FILTER_COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
