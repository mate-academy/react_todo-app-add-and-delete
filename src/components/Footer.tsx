import React from 'react';
import classnames from 'classnames';
import { StatusFilter } from '../types/StatusFilter';

type Props = {
  activeTodosCount: number;
  filterBy: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
  onClearCompleted: () => void;
  completedTodos: boolean;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  filterBy,
  onFilterChange,
  onClearCompleted,
  completedTodos,
}) => {
  const itemsLeftText = activeTodosCount === 1 ? 'item' : 'items';

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} ${itemsLeftText} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classnames('filter__link', {
            selected: filterBy === StatusFilter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={e => {
            e.preventDefault();
            onFilterChange(StatusFilter.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classnames('filter__link', {
            selected: filterBy === StatusFilter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={e => {
            e.preventDefault();
            onFilterChange(StatusFilter.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classnames('filter__link', {
            selected: filterBy === StatusFilter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={e => {
            e.preventDefault();
            onFilterChange(StatusFilter.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
