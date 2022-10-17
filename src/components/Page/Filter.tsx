import classNames from 'classnames';
import React, { useMemo } from 'react';
import { FilterType } from '../../types/FilterTypeEnum';
import { Todo } from '../../types/Todo';

type Props = {
  handleChooseFilter: (filter: FilterType) => void;
  todos: Todo[];
  filterType: FilterType;
  handleClearCompleted: () => void;
};

export const Filter: React.FC<Props> = ({
  handleChooseFilter,
  todos,
  filterType,
  handleClearCompleted,
}) => {
  const activeTodos = useMemo(() => todos
    .filter(({ completed }) => !completed),
  [todos]);
  const completedTodos = useMemo(() => todos
    .filter(({ completed }) => completed),
  [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.All },
          )}
          onClick={() => handleChooseFilter(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.Active },
          )}
          onClick={() => handleChooseFilter(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.Completed },
          )}
          onClick={() => handleChooseFilter(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={handleClearCompleted}
        disabled={!completedTodos.length}
      >
        {completedTodos.length > 0 && 'Clear completed'}
      </button>
    </footer>
  );
};
