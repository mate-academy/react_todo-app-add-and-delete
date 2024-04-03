import React from 'react';
import { FilterBy } from './types/FiilterBy';
import cn from 'classnames';

interface Props {
  onFilterClick: (value: FilterBy) => void;
  activeTodosCount: number;
  onClearCompleted: () => void;
  selectedFilterBy: FilterBy;
  hasCompletedTodo: boolean;
}

export const Footer: React.FC<Props> = ({
  onFilterClick,
  activeTodosCount,
  onClearCompleted,
  selectedFilterBy,
  hasCompletedTodo,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} items left
    </span>

    <nav className="filter" data-cy="Filter">
      {Object.values(FilterBy).map(filterBy => (
        <a
          key={filterBy}
          href="#/"
          className={cn('filter__link', {
            selected: selectedFilterBy === filterBy,
          })}
          data-cy={`FilterLink${filterBy}`}
          onClick={() => onFilterClick(filterBy)}
        >
          {filterBy}
        </a>
      ))}
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!hasCompletedTodo}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
