import React from 'react';
import classNames from 'classnames';
import { Filters } from '../../types/Filters';

type Props = {
  filterTodos: Filters
  setFilterTodos: (option: Filters) => void
};

export const Navigation: React.FC<Props> = ({
  filterTodos,
  setFilterTodos,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {/* Active filter should have a 'selected' class */}
      <a
        href="#/"
        className={
          classNames(
            ['filter__link'],
            { selected: filterTodos === 'All' },
          )
        }
        data-cy="FilterLinkAll"
        onClick={() => setFilterTodos('All')}
      >
        All
      </a>

      <a
        href="#/active"
        className={
          classNames(
            ['filter__link'],
            { selected: filterTodos === 'Active' },
          )
        }
        data-cy="FilterLinkActive"
        onClick={() => setFilterTodos('Active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={
          classNames(
            ['filter__link'],
            { selected: filterTodos === 'Completed' },
          )
        }
        data-cy="FilterLinkCompleted"
        onClick={() => setFilterTodos('Completed')}
      >
        Completed
      </a>
    </nav>
  );
};
