import React from 'react';
import classNames from 'classnames';
import { SortCondition } from '../../types/enums';

interface Props {
  visibleItemsCount: number;
  filterCondition: SortCondition;
  isCompletedTodos: boolean;
  setFilterCOndition: (condition: SortCondition) => void;
  clearCompleted: () => void;
}

export const Footer: React.FC<Props> = React.memo(({
  visibleItemsCount,
  filterCondition,
  isCompletedTodos,
  setFilterCOndition,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${visibleItemsCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterCondition === SortCondition.All,
          })}
          onClick={() => setFilterCOndition(SortCondition.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterCondition === SortCondition.Active,
          })}
          onClick={() => setFilterCOndition(SortCondition.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterCondition === SortCondition.Completed,
          })}
          onClick={() => setFilterCOndition(SortCondition.Completed)}
        >
          Completed
        </a>
      </nav>

      {isCompletedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => clearCompleted()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
