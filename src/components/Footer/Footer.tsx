import classNames from 'classnames';
import React from 'react';
import { FilterType } from '../../types/FilterType';

interface Props {
  filterBy: (filter: FilterType) => void;
  todosQuantity: number;
  selectedFilter: FilterType;
  removeCompleted: () => void;
  numberOfCompleted: number;
}

export const Footer: React.FC<Props> = ({
  filterBy,
  todosQuantity,
  selectedFilter,
  removeCompleted,
  numberOfCompleted,
}) => {
  const changeFilterType = (filter: FilterType) => {
    filterBy(filter);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosQuantity} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === FilterType.All },
          )}
          onClick={() => changeFilterType(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === FilterType.Active },
          )}
          onClick={() => changeFilterType(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === FilterType.Completed },
          )}
          onClick={() => changeFilterType(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!numberOfCompleted}
        onClick={removeCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
