import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../types/FilterType';

type Props = {
  filterType: FilterType,
  setFilterType: (sortBy: FilterType) => void,
  activeTodosLength: number,
  completedTodosLength: number,
  onClearCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  setFilterType,
  filterType,
  activeTodosLength,
  completedTodosLength,
  onClearCompleted,
}) => {
  const onFilterChange = (filter: FilterType) => () => {
    setFilterType(filter);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosLength} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === FilterType.ALL,
          })}
          onClick={onFilterChange(FilterType.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === FilterType.ACTIVE,
          })}
          onClick={onFilterChange(FilterType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === FilterType.COMPLETED,
          })}
          onClick={onFilterChange(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {completedTodosLength > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
};
