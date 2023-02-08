import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type PropsType = {
  setFilter: (filter: Filter) => void,
  filter: Filter;
  activeTodos: number;
  completedTodos: number;
  handleDeleteCompleted: () => void;
};

export const TodoFooter: React.FC<PropsType> = React.memo(
  ({
    setFilter,
    filter,
    activeTodos,
    completedTodos,
    handleDeleteCompleted,
  }) => (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.All },
          )}
          onClick={() => {
            setFilter(Filter.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.Active },
          )}
          onClick={() => {
            setFilter(Filter.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.Completed },
          )}
          onClick={() => {
            setFilter(Filter.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={() => handleDeleteCompleted()}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  ),
);
