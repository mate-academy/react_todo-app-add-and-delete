import React from 'react';
import cn from 'classnames';

import { Filter } from '../../types/Filter';

interface Props {
  activeItems: number;
  currentFilter: Filter;
  setFilter: (filter: Filter) => void;
  completedItems: number;
  deletedCheckedTodoHandler: () => void;
}

export const Footer: React.FC<Props> = ({
  activeItems,
  currentFilter,
  setFilter,
  completedItems,
  deletedCheckedTodoHandler,
}) => {
  const filterAllHandler = () => {
    setFilter(Filter.All);
  };

  const filterActiveHandler = () => {
    setFilter(Filter.Active);
  };

  const filterCompletedHandler = () => {
    setFilter(Filter.Completed);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeItems} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: currentFilter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={filterAllHandler}
        >
          {Filter.All}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: currentFilter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={filterActiveHandler}
        >
          {Filter.Active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: currentFilter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={filterCompletedHandler}
        >
          {Filter.Completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedItems}
        onClick={deletedCheckedTodoHandler}
      >
        Clear completed
      </button>
    </footer>
  );
};
