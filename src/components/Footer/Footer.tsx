import React from 'react';
import cn from 'classnames';
import { FilterBy } from '../../types/FilterBy';

type Props = {
  quantity: number,
  filterBy: FilterBy,
  setFilterBy: (filter: FilterBy) => void,
  onRemoveCompletedTodo: () => void,
  hasCompletedTodos: boolean,
};

export const Footer: React.FC<Props> = React.memo(({
  quantity,
  filterBy,
  setFilterBy,
  onRemoveCompletedTodo,
  hasCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${quantity} items left`}
      </span>

      <nav className="filter">
        {Object.values(FilterBy).map(filterType => (
          <a
            key={filterType}
            href="#/"
            className={cn('filter__link', {
              selected: filterBy === filterType,
            })}
            onClick={() => setFilterBy(filterType)}
          >
            {filterType}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onRemoveCompletedTodo}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
