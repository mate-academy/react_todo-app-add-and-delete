import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../enums/filter';

type Props = {
  activeCount: number;
  completedCount: number;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeCount,
  completedCount,
  filter,
  setFilter,
  onClearCompleted,
}) => {
  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} item{activeCount !== 1 ? 's' : ''} left
      </span>

      <nav className="filter" data-cy="Filter">
        {[FilterType.All, FilterType.Active, FilterType.Completed].map(type => (
          <a
            key={type}
            href={`#/${type}`}
            className={classNames('filter__link', {
              selected: filter === type,
            })}
            data-cy={`FilterLink${type.charAt(0).toUpperCase() + type.slice(1)}`}
            onClick={e => {
              e.preventDefault();
              handleFilterChange(type);
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </a>
        ))}
      </nav>

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
