import cn from 'classnames';
import { FC, useContext } from 'react';
import { StateContext } from '../../lib/TodosContext';
import { Status } from '../../types/Status';

export const Filters: FC = () => {
  const { query, setQuery } = useContext(StateContext);

  const clickToFilteredTodos = (status: Status) => {
    setQuery(status);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: query === Status.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => clickToFilteredTodos(Status.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: query === Status.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => clickToFilteredTodos(Status.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: query === Status.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => clickToFilteredTodos(Status.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
