import React from 'react';
import { FilterType } from '../types/Filter';
import classNames from 'classnames';

interface Props {
  activeCount: number;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
}

export const TodoFooter: React.FC<Props> = ({
  activeCount,
  filter,
  setFilter,
  hasCompleted,
  onClearCompleted,
}) => {
  const itemText = `${activeCount} ${activeCount === 1 ? 'item' : 'items'} left`;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemText}
      </span>

      <ul className="filter" data-cy="Filter">
        <li>
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: filter === FilterType.All,
            })}
            data-cy="FilterLinkAll"
            onClick={() => setFilter(FilterType.All)}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: filter === FilterType.Active,
            })}
            data-cy="FilterLinkActive"
            onClick={() => setFilter(FilterType.Active)}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: filter === FilterType.Completed,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => setFilter(FilterType.Completed)}
          >
            Completed
          </a>
        </li>
      </ul>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
