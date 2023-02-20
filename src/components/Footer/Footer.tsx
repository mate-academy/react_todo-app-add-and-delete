import React from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  setFilterBy: (filterType: FilterType) => void,
  filterBy: FilterType,
  removeAllCompletedTodos: () => void,
  numberOfNotCompletedTodos: number,
  isClearAllButtonVisible: boolean,
};

export const Footer: React.FC<Props> = ({
  setFilterBy,
  filterBy,
  removeAllCompletedTodos,
  numberOfNotCompletedTodos,
  isClearAllButtonVisible,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${numberOfNotCompletedTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === FilterType.ALL,
          })}
          onClick={() => setFilterBy(FilterType.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === FilterType.ACTIVE,
          })}
          onClick={() => setFilterBy(FilterType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === FilterType.COMPLETED,
          })}
          onClick={() => setFilterBy(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={removeAllCompletedTodos}
        disabled={isClearAllButtonVisible}
      >
        Clear completed
      </button>
    </footer>
  );
};
