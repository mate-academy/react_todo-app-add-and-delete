import React from 'react';
import classNames from 'classnames';
import { FilteredBy } from '../../types/FilteredBy';

type Props = {
  filterBy: FilteredBy,
  setFilterBy: (FilteredBy: FilteredBy) => void,
  isActiveTodos: boolean,
  clearCompletedTodo: () => void,
};

export const Footer: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  isActiveTodos,
  clearCompletedTodo,
}) => {
  const onFilterChange = (filter: FilteredBy) => () => {
    if (filterBy !== filter) {
      setFilterBy(filter);
    }
  };

  const handleClearCompleted = () => {
    clearCompletedTodo();
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        3 items left
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link', { selected: filterBy === FilteredBy.ALL },
          )}
          onClick={onFilterChange(FilteredBy.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link', { selected: filterBy === FilteredBy.ACTIVE },
          )}
          onClick={onFilterChange(FilteredBy.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link', { selected: filterBy === FilteredBy.COMPLETED },
          )}
          onClick={onFilterChange(FilteredBy.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {isActiveTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearCompleted}

        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
