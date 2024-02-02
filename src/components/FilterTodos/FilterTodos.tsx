import classNames from 'classnames';

import { useContext } from 'react';
import { TodosContext } from '../../context/TodosContext';

import { Status } from '../../types/Status';

export const FilterTodos = () => {
  const { filterTodos, setFilterTodos } = useContext(TodosContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterTodos === Status.all,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setFilterTodos(Status.all)}
      >
        {Status.all}
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterTodos === Status.active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setFilterTodos(Status.active)}
      >
        {Status.active}
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterTodos === Status.completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilterTodos(Status.completed)}
      >
        {Status.completed}
      </a>
    </nav>
  );
};
