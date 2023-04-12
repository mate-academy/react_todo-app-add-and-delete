import React from 'react';
import classNames from 'classnames';
import { SortType } from '../types/SortType';

type Props = {
  sortType: SortType,
  setSortType: (sortBy: SortType) => void,
  activeTodosLength: number,
  completedTodosLength: number,
  onClearCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  setSortType,
  sortType,
  activeTodosLength,
  completedTodosLength,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {activeTodosLength}
        {' '}
        items left
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: sortType === SortType.ALL,
          })}
          onClick={() => setSortType(SortType.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: sortType === SortType.ACTIVE,
          })}
          onClick={() => setSortType(SortType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: sortType === SortType.COMPLETE,
          })}
          onClick={() => setSortType(SortType.COMPLETE)}
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
