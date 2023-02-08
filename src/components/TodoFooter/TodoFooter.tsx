import React from 'react';
import classNames from 'classnames';

import { Filter } from '../../types/Filter';

type Props = {
  todosLength: number | undefined;
  filter: Filter;
  onChange: (selector: Filter) => void;
  activeClearBtn: boolean;
  clearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  todosLength,
  filter,
  onChange,
  activeClearBtn,
  clearCompleted,
}) => {
  const onAllClick = () => {
    onChange(Filter.all);
  };

  const onActiveClick = () => {
    onChange(Filter.active);
  };

  const onCompletedClick = () => {
    onChange(Filter.completed);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${todosLength} items left`}</span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filter.all,
          })}
          onClick={onAllClick}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filter.active,
          })}
          onClick={onActiveClick}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filter.completed,
          })}
          onClick={onCompletedClick}
        >
          Completed
        </a>
      </nav>

      {activeClearBtn && (
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
