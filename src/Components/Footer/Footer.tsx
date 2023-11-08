import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterParams } from '../../types/FilteredParams';

type Props = {
  activeItems: Todo[];
  filterValue: FilterParams,
  setFilterValue: (filterValue: FilterParams) => void;
};

export const Footer: React.FC<Props> = ({
  activeItems,
  filterValue,
  setFilterValue,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeItems.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterValue === FilterParams.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            setFilterValue(FilterParams.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterValue === FilterParams.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            setFilterValue(FilterParams.ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterValue === FilterParams.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setFilterValue(FilterParams.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
