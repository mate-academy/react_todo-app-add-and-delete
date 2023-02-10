import React from 'react';
import classNames from 'classnames';

import { Filter } from '../../types/Filter';

type Props = {
  todosLength: number | undefined;
  selectFilter: Filter;
  switchFilter: (selector: Filter) => void;
  hasIncompleteTodos: boolean;
  clearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  todosLength,
  selectFilter,
  switchFilter,
  hasIncompleteTodos,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${todosLength} items left`}</span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectFilter === Filter.all,
          })}
          onClick={() => switchFilter(Filter.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectFilter === Filter.active,
          })}
          onClick={() => switchFilter(Filter.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectFilter === Filter.completed,
          })}
          onClick={() => switchFilter(Filter.completed)}
        >
          Completed
        </a>
      </nav>

      {hasIncompleteTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
