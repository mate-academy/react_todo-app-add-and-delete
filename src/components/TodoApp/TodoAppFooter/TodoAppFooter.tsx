import React from 'react';
import classNames from 'classnames';

import { SortType } from '../../../types/SortType';

type Props = {
  activeTodosCount: number,
  sortType: SortType,
  handleSortTypeChange: (param: SortType) => void,
  deleteCompletedTodos: () => void,
};

export const TodoAppFooter: React.FC<Props> = ({
  activeTodosCount,
  sortType,
  handleSortTypeChange,
  deleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: sortType === SortType.ALL,
            },
          )}
          onClick={() => handleSortTypeChange(SortType.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: sortType === SortType.ACTIVE,
            },
          )}
          onClick={() => handleSortTypeChange(SortType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: sortType === SortType.COMPLETED,
            },
          )}
          onClick={() => handleSortTypeChange(SortType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
