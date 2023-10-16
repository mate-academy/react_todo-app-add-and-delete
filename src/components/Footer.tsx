import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/FilterBy';

type Props = {
  todos: Todo[];
  filterBy: Filter;
  setFilterBy: (item: Filter) => void;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
  handleClearCompleted,
}) => {
  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterBy(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterBy === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterBy(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterBy === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterBy(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      { activeTodosCount && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
