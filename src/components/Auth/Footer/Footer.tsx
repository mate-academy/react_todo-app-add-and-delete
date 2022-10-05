import classNames from 'classnames';
import React, { useMemo } from 'react';
import { FilterType } from '../../../types/FilterBy';
import { Todo } from '../../../types/Todo';

type Props = {
  filterTypes: (arg: FilterType) => void;
  filterType: FilterType,
  todos: Todo[],
  deleteCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  filterTypes,
  filterType,
  todos,
  deleteCompleted,
}) => {
  const notCompletedTodos = useMemo(() => (
    todos.filter(({ completed }) => !completed)
  ), [todos]);

  const todosCompletedLength = useMemo(() => (
    todos.filter(todo => todo.completed).length),
  [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${notCompletedTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType },
          )}
          onClick={() => {
            filterTypes(FilterType.All);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType },
          )}
          onClick={() => filterTypes(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType },
          )}
          onClick={() => filterTypes(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompleted}
        disabled={!todosCompletedLength}
      >
        Clear completed
      </button>

    </footer>
  );
};
