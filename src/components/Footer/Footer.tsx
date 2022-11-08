import classNames from 'classnames';
import React, { useMemo } from 'react';

import { SortType } from '../../types/SortType';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  sortType: SortType;
  setSortType: (item: SortType) => void;
  clearCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  sortType,
  setSortType,
  clearCompletedTodos,
}) => {
  const todosLeft = useMemo(() => (
    todos.filter(({ completed }) => !completed).length
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed).length
  ), [todos]);

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
            { selected: sortType === SortType.All },
          )}
          onClick={() => setSortType(SortType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: sortType === SortType.Active },
          )}
          onClick={() => setSortType(SortType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: sortType === SortType.Completed },
          )}
          onClick={() => setSortType(SortType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompletedTodos}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
