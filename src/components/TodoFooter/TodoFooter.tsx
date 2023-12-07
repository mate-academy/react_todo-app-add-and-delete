import React, { useContext } from 'react';
import classNames from 'classnames';

import { Filter } from '../../types/Filter';
import { GlobalContext } from '../../providers';

export const TodoFooter: React.FC = () => {
  const {
    todos,
    filter,
    setFilter,
    handleDelete,
  } = useContext(GlobalContext);

  const counter: number = todos.filter(todo => !todo.completed).length;

  const ClearCompleted = () => {
    todos.map(todo => todo.completed && handleDelete(todo));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${counter} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link', { selected: filter === Filter.All },
          )}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link', { selected: filter === Filter.Active },
          )}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link', { selected: filter === Filter.Completed },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={ClearCompleted}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
