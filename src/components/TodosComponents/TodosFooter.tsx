import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterValues } from '../../types/FilterValues';

type Props = {
  todos: Todo[],
  todoFilter: FilterValues,
  onFilterByCompleted: (todoStatus: FilterValues) => void,
};

export const TodosFooter: React.FC<Props> = ({
  todos,
  todoFilter,
  onFilterByCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            {
              'filter__link selected': todoFilter === FilterValues.ALL,
            },
          )}
          onClick={() => onFilterByCompleted(FilterValues.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            {
              'filter__link selected': todoFilter === FilterValues.COMPLETED,
            },
          )}
          onClick={() => onFilterByCompleted(FilterValues.COMPLETED)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              'filter__link selected': todoFilter === FilterValues.ACTIVE,
            },
          )}
          onClick={() => onFilterByCompleted(FilterValues.ACTIVE)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          {
            'todoapp__clear-completed--hidden': false,
          },
        )}
      >
        Clear completed
      </button>
    </footer>
  );
};
