import cn from 'classnames';
import React, { useCallback } from 'react';
import { FilterType } from '../../types/FilterType';

type Props = {
  activeTodos: number;
  hasCompletedTodos: number;
  filterType: FilterType;
  changeFilterType: (value: FilterType) => void;
  deleteCompleted: () => void;
};

export const Footer: React.FC<Props> = React.memo(({
  activeTodos,
  hasCompletedTodos,
  filterType,
  changeFilterType,
  deleteCompleted,
}) => {
  const handleFilterType = useCallback((type: FilterType) => {
    changeFilterType(type);
  }, []);

  const isSelected = useCallback((type: FilterType) => filterType === type,
    [filterType]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { selected: isSelected(FilterType.ALL) },
          )}
          onClick={() => {
            handleFilterType(FilterType.ALL);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            { selected: isSelected(FilterType.ACTIVE) },
          )}
          onClick={() => {
            handleFilterType(FilterType.ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: isSelected(FilterType.COMPLETED) },
          )}
          onClick={() => {
            handleFilterType(FilterType.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{
          visibility: hasCompletedTodos
            ? 'visible'
            : 'hidden',
        }}
        onClick={deleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
