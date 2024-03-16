import React, { useContext } from 'react';
import cn from 'classnames';
import { Status } from '../../types/Status';
import { TodoContext } from '../Store/TodoContext';

export const Filter: React.FC = () => {
  const { filterValue, setFilterValue } = useContext(TodoContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href={Status.All}
        className={cn('filter__link', {
          selected: filterValue === Status.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setFilterValue(Status.All)}
      >
        All
      </a>

      <a
        href={Status.Active}
        className={cn('filter__link', {
          selected: filterValue === Status.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setFilterValue(Status.Active)}
      >
        Active
      </a>

      <a
        href={Status.Completed}
        className={cn('filter__link', {
          selected: filterValue === Status.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilterValue(Status.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
