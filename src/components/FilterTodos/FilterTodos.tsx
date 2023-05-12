import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  activeTodosCount: number;
  isCompletedTodos: boolean;
  filterType: FilterType;
  onFilter: (filterType: FilterType) => void;
  clearCompleted: () => void;
};

export const FilterTodos: React.FC<Props> = ({
  activeTodosCount, isCompletedTodos, filterType, onFilter, clearCompleted,
}) => {
  const handlerFilter = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    onFilter(e.currentTarget.innerText as FilterType);
  };

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
            { selected: filterType === FilterType.ALL },
          )}
          onClick={handlerFilter}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.ACTIVE },
          )}
          onClick={handlerFilter}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.COMPLETED },
          )}
          onClick={handlerFilter}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
        disabled={!isCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
