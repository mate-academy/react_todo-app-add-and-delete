import React, { useMemo } from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  setFilterType: (value: FilterStatus) => void,
  filterType: FilterStatus,
  onRemove: () => void;
};

export const TodosFilter: React.FC<Props> = ({
  todos,
  setFilterType,
  filterType,
  onRemove,
}) => {
  const todosLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const todosCompleted = todos.length - todosLeft;

  if (todos.length < 1) {
    return null;
  }

  return (
    <footer
      className="todoapp__footer"
      data-cy="Footer"
    >
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          onClick={() => setFilterType(FilterStatus.All)}
          className={classNames(
            'filter__link',
            {
              selected: filterType === FilterStatus.All,
            },
          )}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          onClick={() => setFilterType(FilterStatus.Active)}
          className={classNames(
            'filter__link',
            {
              selected: filterType === FilterStatus.Active,
            },
          )}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          onClick={() => setFilterType(FilterStatus.Completed)}
          className={classNames(
            'filter__link',
            {
              selected: filterType === FilterStatus.Completed,
            },
          )}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        onClick={onRemove}
        type="button"
        className="todoapp__clear-completed"
        disabled={!todosCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
