import React from 'react';
import cn from 'classnames';
import { Filter, filterLinks } from '../../types/Filter';

type Props = {
  activeTodosCount: number;
  completedTodosCount: number;
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  handleClearCompleted: () => Promise<void>;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  completedTodosCount,
  filter,
  onFilterChange,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks.map(({ value, href, label, dataCy }) => (
          <a
            key={value}
            href={href}
            className={cn('filter__link', { selected: filter === value })}
            data-cy={dataCy}
            onClick={() => onFilterChange(value)}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
