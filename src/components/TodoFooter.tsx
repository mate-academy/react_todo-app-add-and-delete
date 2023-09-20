import React from 'react';
import classNames from 'classnames';
import { TodoFilter } from '../types/TodoFilter';

type Props = {
  filter: TodoFilter;
  setFilter: (newFilter: TodoFilter) => void;
  activeTodosCount: number;
  completedTodosCount: number;
};

export const TodoFooter: React.FC<Props> = ({
  filter,
  setFilter,
  activeTodosCount,
  completedTodosCount,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.keys(TodoFilter).map((filterName) => (
          <a
            href={`#/${filterName}`}
            className={classNames('filter__link', {
              selected: filterName === filter,
            })}
            data-cy={`FilterLink${filterName}`}
            onClick={() => setFilter(filterName as TodoFilter)}
          >
            {filterName}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
