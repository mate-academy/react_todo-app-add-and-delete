import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../types/FilterType';

interface FooterProps {
  todosCounter: number;
  completedCount: number;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  handleClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  todosCounter,
  completedCount,
  filter,
  onFilterChange,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(filt => (
          <a
            key={filt}
            href={`#/${filt}`}
            className={classNames('filter__link', {
              selected: filter === filt,
            })}
            data-cy={`FilterLink${filt.charAt(0).toUpperCase() + filt.slice(1)}`}
            onClick={() => onFilterChange(filt)}
          >
            {filt.charAt(0).toUpperCase() + filt.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
