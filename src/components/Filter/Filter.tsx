import cl from 'classnames';
import React, { useContext } from 'react';
import { Status } from '../../types/Status';
import { Context } from '../constext';

export const Filter: React.FC = () => {
  const { setFilter, filter } = useContext(Context);

  const choiceFilter = (st: Status) => setFilter(st);

  return (
    <nav className="filter" data-cy="Filter">
      {/* Active link should have the 'selected' class */}

      <a
        href="#/"
        className={cl('filter__link', {
          selected: filter === Status.ALL,
        })}
        data-cy="FilterLinkAll"
        onClick={() => choiceFilter(Status.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cl('filter__link', {
          selected: filter === Status.ACTIVE,
        })}
        data-cy="FilterLinkActive"
        onClick={() => choiceFilter(Status.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cl('filter__link', {
          selected: filter === Status.COMPLETED,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => choiceFilter(Status.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
