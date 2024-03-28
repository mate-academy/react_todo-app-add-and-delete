import classNames from 'classnames';
import React from 'react';

export enum Filter {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

type Props = {
  value: Filter;
  itemsLeft: number;
  completedItemsLeft: number;
  onClearCompleted: () => void;
  onFilter: (value: Filter) => void;
};

export const Footer: React.FC<Props> = ({
  value,
  itemsLeft,
  completedItemsLeft,
  onClearCompleted,
  onFilter,
}) => {
  return (
    // {/* Hide the footer if there are no todos */}
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: value === Filter.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            onFilter(Filter.all);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: value === Filter.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            onFilter(Filter.active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: value === Filter.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            onFilter(Filter.completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedItemsLeft < 1}
        onClick={() => onClearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
