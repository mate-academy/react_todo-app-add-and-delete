import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filters';
import React from 'react';

type Props = {
  todos: Todo[];
  filter: string | null;
  onFilter: (filterOption: string) => void;
  onDelete: (list: Todo[]) => void;
};

export const FooterComponent: React.FC<Props> = React.memo(
  ({ todos, filter, onFilter, onDelete }) => {
    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {`${[...todos].filter(todo => !todo.completed).length} items left`}
        </span>

        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: filter === Filter.All || filter === null,
            })}
            data-cy="FilterLinkAll"
            onClick={() => onFilter(Filter.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: filter === Filter.Active,
            })}
            data-cy="FilterLinkActive"
            onClick={() => onFilter(Filter.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: filter === Filter.Completed,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => onFilter(Filter.Completed)}
          >
            Completed
          </a>
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={() => onDelete(todos.filter(todo => todo.completed))}
          disabled={!todos.some(todo => todo.completed)}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);

FooterComponent.displayName = 'Footer';
