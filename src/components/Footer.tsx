import React from 'react';
import classNames from 'classnames';
import { Filter } from '../enums/Filter';

type Props = {
  activeCount: number;
  completedCount: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  onClearCompleted: () => void;
};

const filterLabels = {
  [Filter.All]: 'All',
  [Filter.Active]: 'Active',
  [Filter.Completed]: 'Completed',
};

export const Footer: React.FC<Props> = ({
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

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(value => (
          <a
            key={value}
            href={`#/${value}`}
            className={classNames('filter__link', {
              selected: filter === value,
            })}
            data-cy={`FilterLink${filterLabels[value]}`}
            onClick={() => setFilter(value)}
          >
            {filterLabels[value]}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
