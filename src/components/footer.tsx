import React from 'react';
import { FilteredStatus, Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  filteredStatus: FilteredStatus;
  setFilteredStatus: (f: FilteredStatus) => void;
  deleteAllCompletedTodo: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filteredStatus,
  setFilteredStatus,
  deleteAllCompletedTodo,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filteredStatus === FilteredStatus.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilteredStatus(FilteredStatus.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filteredStatus === FilteredStatus.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilteredStatus(FilteredStatus.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filteredStatus === FilteredStatus.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilteredStatus(FilteredStatus.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={deleteAllCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};

Footer.displayName = 'Footer';
