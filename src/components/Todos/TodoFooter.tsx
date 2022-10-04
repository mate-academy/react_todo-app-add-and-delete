import classNames from 'classnames';
import React from 'react';
import { FilterTypes } from '../../types/FilterTypes';

interface Props {
  filterType: FilterTypes;
  change: (value: FilterTypes) => void;
  deleteAllCompletedTodos: () => void;
}

const TodoFooter: React.FC<Props> = ({
  filterType,
  change,
  deleteAllCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        4 items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link', { selected: filterType === FilterTypes.All },
          )}
          onClick={() => change(FilterTypes.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link', { selected: filterType === FilterTypes.Active },
          )}
          onClick={() => change(FilterTypes.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link', { selected: filterType === FilterTypes.Completed },
          )}
          onClick={() => change(FilterTypes.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default TodoFooter;
