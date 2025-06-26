import classNames from 'classnames';
import React from 'react';
import { Filter } from '../../types/Filter';

interface FooterProps {
  activeCount: number;
  completedCount: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeCount,
  completedCount,
  filter,
  setFilter,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(option => (
          <a
            key={option}
            href={`#/${option === Filter.all ? '' : option}`}
            className={classNames('filter__link', {
              selected: filter === option,
            })}
            data-cy={`FilterLink${option.charAt(0).toUpperCase() + option.slice(1)}`}
            onClick={e => {
              e.preventDefault();
              setFilter(option);
            }}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
