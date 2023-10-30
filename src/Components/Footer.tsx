import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/FilterBy';

interface Props {
  todos: Todo[],
  filterBy: Filter,
  setFilterBy: (filter: Filter) => void,
}

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
}) => {
  const itemsLeft = todos.filter(todo => todo.completed === false).length;

  const handleClearCompleted = () => {
    setFilterBy(Filter.Active);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
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

      {itemsLeft && (
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
