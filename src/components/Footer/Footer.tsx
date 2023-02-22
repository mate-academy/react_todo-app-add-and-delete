import classNames from 'classnames';
import React from 'react';
import { FilterType } from '../../types/FilterType';

type Props = {
  setFilterField: (field: FilterType) => void,
  filterBy: FilterType,
  hasCompletedTodos: boolean,
  activeTodo: number,
  handleDeleteCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = React.memo(({
  setFilterField,
  filterBy,
  hasCompletedTodos,
  activeTodo,
  handleDeleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodo} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link', {
              selected: filterBy === FilterType.ALL,
            },
          )}
          onClick={() => setFilterField(FilterType.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link', {
              selected: filterBy === FilterType.ACTIVE,
            },
          )}
          onClick={() => setFilterField(FilterType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link', {
              selected: filterBy === FilterType.COMPLETED,
            },
          )}
          onClick={() => setFilterField(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{
          visibility: hasCompletedTodos
            ? 'visible'
            : 'hidden',
        }}
        onClick={handleDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
