import React from 'react';
import cn from 'classnames';

import { Filter } from '../types/Filter';

const FILTER_LINKS: Filter[] = ['All', 'Active', 'Completed'];

interface TodoFooterProps {
  setFilterBy: React.Dispatch<React.SetStateAction<Filter>>;
  filterBy: Filter;
  activeTodosCount: number;
  completedTodosCount: number;
  onClick: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = React.memo(
  ({
    setFilterBy,
    filterBy,
    activeTodosCount,
    completedTodosCount,
    onClick,
  }) => {
    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeTodosCount} items left
        </span>

        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          {FILTER_LINKS.map(filterLink => (
            <a
              key={filterLink}
              href={`#/${filterLink.toLowerCase()}`}
              className={cn('filter__link', {
                selected: filterLink === filterBy,
              })}
              data-cy={`FilterLink${filterLink}`}
              onClick={() => setFilterBy(filterLink)}
            >
              {filterLink}
            </a>
          ))}
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={onClick}
          disabled={completedTodosCount === 0}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);

TodoFooter.displayName = 'TodoFooter';
