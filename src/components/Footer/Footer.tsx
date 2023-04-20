import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  activeTodosCount: number,
  completedTodosCount: number,
  filterType: FilterType,
  onChangeFilter: (filter: FilterType) => (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => void,
  onClearCompleted: () => void
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  completedTodosCount,
  filterType,
  onChangeFilter,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${activeTodosCount} item${activeTodosCount === 1 ? '' : 's'} left`}
    </span>

    <nav className="filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filterType === FilterType.All },
        )}
        onClick={onChangeFilter(FilterType.All)}
      >
        {FilterType.All}
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filterType === FilterType.Active },
        )}
        onClick={onChangeFilter(FilterType.Active)}
      >
        {FilterType.Active}
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filterType === FilterType.Completed },
        )}
        onClick={onChangeFilter(FilterType.Completed)}
      >
        {FilterType.Completed}
      </a>
    </nav>

    {completedTodosCount > 0 && (
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
