import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { FilterType } from '../../types/FilterType';

type Props = {
  filterType: FilterType
  setFilterType: (status: FilterType) => void
  completedTodos: number
  todosLength: number
  onRemove: () => Promise<void>
};

export const Footer: React.FC<Props> = React.memo(({
  filterType,
  setFilterType,
  completedTodos,
  onRemove,
  todosLength,
}) => {
  const uncompletedCount = todosLength - completedTodos;

  const filterHrefByType = useMemo(() => ({
    [FilterType.All]: '#/',
    [FilterType.Active]: '#/active',
    [FilterType.Completed]: '#/completed',
  }), []);

  const filterTypeList = useMemo(() => (
    Object.values(FilterType)
  ), []);

  const handleFilterType = useCallback(() => (
    (status: FilterType) => setFilterType(status)
  ), []);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${uncompletedCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterTypeList.map(status => (
          <a
            data-cy="FilterLinkAll"
            href={filterHrefByType[status]}
            key={status}
            className={classNames('filter__link', {
              selected: filterType === status,
            })}
            onClick={handleFilterType}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames('todoapp__clear-completed', {
          hidden: completedTodos <= 0,
        })}
        onClick={onRemove}
      >
        Clear completed
      </button>
    </footer>
  );
});
