import React from 'react';
import cn from 'classnames';
import { FilterBy } from '../../types/FilterBy';

type Props = {
  filterBy: FilterBy,
  setFilterBy: (FilterBy:FilterBy) => void,
  isActiveTodo: boolean,
  clearCompleatedTodos: () => void,
};

export const Footer: React.FC<Props> = (
  {
    filterBy,
    setFilterBy,
    isActiveTodo,
    clearCompleatedTodos,
  },
) => {
  const handleClick = (value:FilterBy) => {
    if (filterBy !== value) {
      setFilterBy(value);
    }
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        3 items left
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link',
            { selected: filterBy === FilterBy.ALL })}
          onClick={() => handleClick(FilterBy.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: filterBy === FilterBy.ACTIVE })}
          onClick={() => handleClick(FilterBy.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filterBy === FilterBy.COMPLETED })}
          onClick={() => handleClick(FilterBy.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {isActiveTodo
      && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => clearCompleatedTodos()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
