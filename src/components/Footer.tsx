import React from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  activeTodosNumber: number;
  completedTodosNumber: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  onDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosNumber,
  completedTodosNumber,
  filter,
  setFilter,
  onDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosNumber} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link',
            { selected: filter === 'all' })}
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link',
            { selected: filter === 'active' })}
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link',
            { selected: filter === 'completed' })}
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onDeleteCompleted}
        style={{ color: completedTodosNumber > 0 ? 'inherit' : 'transparent' }}
      >
        Clear completed
      </button>
    </footer>
  );
};
