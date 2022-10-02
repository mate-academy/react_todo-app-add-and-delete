import classNames from 'classnames';
import React from 'react';
import { Filter } from '../../../context/TodoContext';
import { Todo } from '../../../types/Todo';

type Props = {
  todos: Todo[],
  filterState: Filter,
  handleFilter: (filterStatus: Filter, data: Todo[]) => void,
};

export const FilterComponent: React.FC<Props> = ({
  todos,
  filterState,
  handleFilter,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="todosCounter">
      {`${todos.filter(todo => !todo.completed).length} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          {
            selected: filterState === Filter.all,
          },
        )}
        onClick={() => handleFilter(Filter.all, todos)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          {
            selected: filterState === Filter.active,
          },
        )}
        onClick={() => handleFilter(Filter.active, todos)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          {
            selected: filterState === Filter.completed,
          },
        )}
        onClick={() => handleFilter(Filter.completed, todos)}
      >
        Completed
      </a>
    </nav>

    <button
      data-cy="ClearCompletedButton"
      type="button"
      className="todoapp__clear-completed"
    >
      Clear completed
    </button>
  </footer>
);
