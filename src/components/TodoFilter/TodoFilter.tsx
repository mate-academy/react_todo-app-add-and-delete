import cn from 'classnames';
import React from 'react';
import { FilterBy } from '../../types/Filter';

type Props = {
  filter: string,
  filterTodos: (filter: FilterBy) => void,
  renderClearCompleted: boolean,
};

export const TodoFilter: React.FC<Props> = ({
  filter,
  filterTodos: onFilterClick,
  renderClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        3 items left
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { selected: filter === FilterBy.all },
          )}
          onClick={() => onFilterClick(FilterBy.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filter === FilterBy.active },
          )}
          onClick={() => onFilterClick(FilterBy.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filter === FilterBy.completed },
          )}
          onClick={() => onFilterClick(FilterBy.completed)}
        >
          Completed
        </a>
      </nav>

      {renderClearCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
