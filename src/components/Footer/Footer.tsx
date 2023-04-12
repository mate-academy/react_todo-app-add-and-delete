import React from 'react';
import classNames from 'classnames';
import { FilterTypes } from '../../types/FilterTypes';
import { Todo } from '../../types/Todo';

type Props = {
  filterType: FilterTypes;
  setFilterType: (filter: FilterTypes) => void;
  completedTodos: Todo[];
  activeTodos: Todo[];
  removeCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  filterType,
  setFilterType,
  completedTodos,
  removeCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${activeTodos.length} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === FilterTypes.ALL,
          })}
          onClick={() => setFilterType(FilterTypes.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === FilterTypes.ACTIVE,
          })}
          onClick={() => setFilterType(FilterTypes.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === FilterTypes.COMPLETED,
          })}
          onClick={() => setFilterType(FilterTypes.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'is-invisible': !completedTodos.length,
        })}
        onClick={removeCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
