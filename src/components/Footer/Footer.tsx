import React from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

type Props = {
  todos: Todo[],
  filterType: string,
  onFilterChange: CallableFunction,
};

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  onFilterChange,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={
            classnames(
              'filter__link',
              { selected: filterType === FilterType.All },
            )
          }
          onClick={() => onFilterChange(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={
            classnames(
              'filter__link',
              { selected: filterType === FilterType.Active },
            )
          }
          onClick={() => onFilterChange(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={
            classnames(
              'filter__link',
              { selected: filterType === FilterType.Completed },
            )
          }
          onClick={() => onFilterChange(FilterType.Completed)}
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
};
