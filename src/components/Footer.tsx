import React, { useMemo } from 'react';
import classNames from 'classnames';
import { FilterTypes } from '../types/FilterTypes';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  filterType: string,
  setFilterType: (filterType: FilterTypes) => void,
  deleteTodos: () => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  setFilterType,
  deleteTodos,
}) => {

  const todoNumber = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedTodo = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todoNumber} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link', { selected: FilterTypes.all },
          )}
          onClick={() => setFilterType(FilterTypes.all)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link', { selected: FilterTypes.active },
          )}
          onClick={() => setFilterType(FilterTypes.active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link', { selected: FilterTypes.completed },
          )}
          onClick={() => setFilterType(FilterTypes.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: completedTodo ? 'visible' : 'hidden' }}
        onClick={deleteTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
