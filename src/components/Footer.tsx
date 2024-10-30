import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterState } from '../types/Filter';

interface FooterProps {
  activeCount: number;
  filter: FilterState;
  setFilter: (filter: FilterState) => void;
  handleDeleteCompletedTodos: () => void;
  todos: Todo[];
}

const Footer: React.FC<FooterProps> = ({
  activeCount,
  filter,
  setFilter,
  handleDeleteCompletedTodos,
  todos,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeCount} items left`}
    </span>
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === FilterState.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setFilter(FilterState.All)}
      >
        All
      </a>
      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === FilterState.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setFilter(FilterState.Active)}
      >
        Active
      </a>
      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === FilterState.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilter(FilterState.Completed)}
      >
        Completed
      </a>
    </nav>
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={todos.every(todo => !todo.completed)}
      onClick={handleDeleteCompletedTodos}
    >
      Clear completed
    </button>
  </footer>
);

export default Footer;
