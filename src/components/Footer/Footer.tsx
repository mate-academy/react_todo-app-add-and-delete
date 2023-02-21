import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  filterType: FilterType;
  removeCompletedTodos: () => void;
  handleFiltering: (filter: FilterType) => void;
  isSomeThingDone: boolean;
  activeTodosAmount: number;
};

export const Footer: React.FC<Props> = React.memo(({
  filterType,
  removeCompletedTodos,
  handleFiltering,
  isSomeThingDone,
  activeTodosAmount,
}) => {
  const sortBy = (filter: FilterType) => {
    handleFiltering(filter);
  };

  const handleClearCompleted = () => {
    removeCompletedTodos();
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${activeTodosAmount} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === FilterType.All,
          })}
          onClick={() => sortBy(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Active,
          })}
          onClick={() => sortBy(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Completed,
          })}
          onClick={() => sortBy(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: isSomeThingDone ? 'visible' : 'hidden' }}
        disabled={!isSomeThingDone}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
