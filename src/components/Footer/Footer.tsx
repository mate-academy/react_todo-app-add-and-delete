import classNames from 'classnames';
import React, { useMemo } from 'react';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  filteredType: (arg: FilterType) => void;
  filterType: FilterType | string,
  todos: Todo[],
  deleteCompleted: () => void,

};

export const Footer: React.FC<Props> = ({
  filterType,
  filteredType,
  todos,
  deleteCompleted,
}) => {
  const unFinishedTodos = useMemo(() => (
    todos.filter(({ completed }) => !completed)),
  [todos]);

  const todosCompletedLength = useMemo(() => (
    todos.filter(todo => todo.completed).length),
  [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${unFinishedTodos.length} items left`}
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
            filteredType(FilterType.All);
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
          onClick={() => filteredType(FilterType.Active)}
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
          onClick={() => filteredType(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      {todosCompletedLength > 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={deleteCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
