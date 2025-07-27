import React from 'react';
import classNames from 'classnames';

import { Filter } from '../../FilterEnum';

type Props = {
  currFilter: Filter;
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  onFilterClick: (newFilter: Filter) => void;
  onClearCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  currFilter,
  activeTodosCount,
  hasCompletedTodos,
  onFilterClick,
  onClearCompletedTodos,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeTodosCount} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      {Object.values(Filter).map(filter => {
        const capitalizedFilter =
          filter[0].toUpperCase() + filter.slice(1).toLowerCase();

        return (
          <a
            key={filter}
            href={`#/${filter === Filter.All ? '' : filter}`}
            className={classNames('filter__link', {
              selected: currFilter === filter,
            })}
            data-cy={`FilterLink${capitalizedFilter}`}
            onClick={() => onFilterClick(filter)}
          >
            {capitalizedFilter}
          </a>
        );
      })}
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={onClearCompletedTodos}
      disabled={!hasCompletedTodos}
    >
      Clear completed
    </button>
  </footer>
);
