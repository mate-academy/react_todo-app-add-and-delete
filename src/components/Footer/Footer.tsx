import React from 'react';
import classNames from 'classnames';
import { FilterBy } from '../../types';

type Props = {
  activeTodosCount: number,
  filterType: FilterBy,
  setFilter: (filterType: FilterBy) => void,
  isClearButtonVisible: boolean,
  onDeleteCompleted: () => void,
};

export const Footer: React.FC<Props> = React.memo(
  ({
    filterType,
    setFilter,
    activeTodosCount,
    isClearButtonVisible,
    onDeleteCompleted,
  }) => (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterBy.ALL },
          )}
          onClick={() => setFilter(FilterBy.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterBy.ACTIVE },
          )}
          onClick={() => setFilter(FilterBy.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterBy.COMPLETED },
          )}
          onClick={() => setFilter(FilterBy.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!isClearButtonVisible}
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  ),
);
