import classNames from 'classnames';
import React from 'react';
import { FilterType } from '../../types/FilterType';

type Props = {
  filterType: FilterType,
  setFilterType: (filter: FilterType) => void,
  activeTodosQuantity: number,
  completedTodosQuantity: number,
  onClearCompleted: () => void
};

export const TodoFooter: React.FC<Props> = ({
  filterType,
  setFilterType,
  activeTodosQuantity,
  completedTodosQuantity,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosQuantity} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.All },
          )}
          onClick={() => setFilterType(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.Active },
          )}
          onClick={() => setFilterType(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.Completed },
          )}
          onClick={() => setFilterType(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      {completedTodosQuantity > 0 && (
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
