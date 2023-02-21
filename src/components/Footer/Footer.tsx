import React from 'react';
import classNames from 'classnames';

import { FilterBy } from '../../types/Filter';

type Props = {
  filterBy: FilterBy,
  setFilterBy: (filterBy: FilterBy) => void;
  activeTodosAmount: number,
  isClearButtonVisible: boolean,
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  activeTodosAmount,
  isClearButtonVisible,
  onClearCompleted,
}) => {
  const checkFilter = (filter: FilterBy) => {
    return filterBy === filter;
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosAmount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link',
            { selected: checkFilter(FilterBy.ALL) })}
          onClick={() => setFilterBy(FilterBy.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link',
            { selected: checkFilter(FilterBy.ACTIVE) })}
          onClick={() => setFilterBy(FilterBy.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link',
            { selected: checkFilter(FilterBy.COMPLETED) })}
          onClick={() => setFilterBy(FilterBy.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!isClearButtonVisible}
        onClick={onClearCompleted}
      >
        Clear completed
        {isClearButtonVisible && 'Clear completed'}
      </button>
    </footer>
  );
};
