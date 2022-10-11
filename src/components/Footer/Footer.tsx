import React from 'react';
import cN from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  filteredType: number,
  completedTodoNumber: number,
  notCompletedTodoNumber: number,
  setFilteredType: (value: number) => void,
  handleClearCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = React.memo(
  ({
    filteredType,
    completedTodoNumber,
    notCompletedTodoNumber,
    setFilteredType,
    handleClearCompletedTodos,
  }) => {
    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="todosCounter">
          {`${notCompletedTodoNumber} items left`}
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            data-cy="FilterLinkAll"
            href="#/"
            className={cN(
              'filter__link',
              { selected: filteredType === FilterType.All },
            )}
            onClick={() => setFilteredType(FilterType.All)}
          >
            All
          </a>

          <a
            data-cy="FilterLinkActive"
            href="#/active"
            className={cN(
              'filter__link',
              { selected: filteredType === FilterType.Active },
            )}
            onClick={() => setFilteredType(FilterType.Active)}
          >
            Active
          </a>
          <a
            data-cy="FilterLinkCompleted"
            href="#/completed"
            className={cN(
              'filter__link',
              { selected: filteredType === FilterType.Completed },
            )}
            onClick={() => setFilteredType(FilterType.Completed)}
          >
            Completed
          </a>
        </nav>

        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearCompletedTodos}
        >
          {completedTodoNumber > 0 && 'Clear completed'}
        </button>
      </footer>
    );
  },
);
