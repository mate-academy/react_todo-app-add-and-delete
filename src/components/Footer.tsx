import classNames from 'classnames';
import React from 'react';
import { FilterMethods } from '../types/FilterMethods';
import { Todo } from '../types/Todo';

type Props = {
  filterMethod: FilterMethods;
  setFilterMethod: (status: FilterMethods) => void;
  todosLeft: number;
  completedTodos: Todo[],
  removeCompletedTodos: () => void;
};

export const Footer:React.FC<Props> = ({
  filterMethod,
  setFilterMethod,
  todosLeft,
  completedTodos,
  removeCompletedTodos,
}) => {
  const hideClearButton = completedTodos.length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: filterMethod === FilterMethods.ALL,
            },
          )}
          onClick={() => setFilterMethod(FilterMethods.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: filterMethod === FilterMethods.ACTIVE,
            },
          )}
          onClick={() => setFilterMethod(FilterMethods.ACTIVE)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: filterMethod === FilterMethods.COMPLETED,
            },
          )}
          onClick={() => setFilterMethod(FilterMethods.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { hidden: hideClearButton },
        )}
        onClick={removeCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
