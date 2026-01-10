import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/FilterMethods';

type Props = {
  count: (elements: Todo[]) => number;
  todos: Todo[];
  setMethod: (filter: Filter) => void;
  filterMethod: Filter;
  clear: () => void;
};

export const Footer: React.FC<Props> = ({
  count,
  todos,
  setMethod,
  filterMethod,
  clear,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${count(todos)} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            filterMethod === 'All' ? 'filter__link selected' : 'filter__link',
          )}
          data-cy="FilterLinkAll"
          onClick={event => {
            event.preventDefault();
            setMethod('All');
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            filterMethod === 'Active'
              ? 'filter__link selected'
              : 'filter__link',
          )}
          data-cy="FilterLinkActive"
          onClick={event => {
            event.preventDefault();
            setMethod('Active');
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            filterMethod === 'Completed'
              ? 'filter__link selected'
              : 'filter__link',
          )}
          data-cy="FilterLinkCompleted"
          onClick={event => {
            event.preventDefault();
            setMethod('Completed');
          }}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clear}
        disabled={!todos.some(element => element.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
