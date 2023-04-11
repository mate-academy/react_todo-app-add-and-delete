import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../../enums/FilterType';

type Props = {
  filterType: FilterType;
  onFilterChange: (filter: FilterType) => void;
  todosLeftActive: number,
  onClearCompleted: () => void;
  completedTodosCount: number,
};

export const TodoFilter: React.FC<Props> = (props) => {
  const {
    filterType,
    onFilterChange,
    todosLeftActive,
    onClearCompleted,
    completedTodosCount,
  } = props;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosLeftActive} ${todosLeftActive === 1 ? 'item' : 'items'} left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === FilterType.All,
          })}
          onClick={() => onFilterChange(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Active,
          })}
          onClick={() => onFilterChange(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Completed,
          })}
          onClick={() => onFilterChange(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      { completedTodosCount > 0 && (
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
