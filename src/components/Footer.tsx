import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

interface Props {
  activeCount: number;
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  activeCount,
  filter,
  setFilter,
  hasCompleted,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeCount} items left
    </span>

    <nav className="filter" data-cy="Filter">
      {(['all', 'active', 'completed'] as const).map(f => (
        <a
          key={f}
          href={`#/${f === 'all' ? '' : f}`}
          className={classNames('filter__link', {
            selected: filter === f,
          })}
          onClick={e => {
            e.preventDefault();
            setFilter(f);
          }}
          data-cy={`FilterLink${f.charAt(0).toUpperCase() + f.slice(1)}`}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </a>
      ))}
    </nav>

    <button
      type="button"
      data-cy="ClearCompletedButton"
      className="todoapp__clear-completed"
      disabled={!hasCompleted}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
