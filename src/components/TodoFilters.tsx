import React, { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';
import { FILTER_TYPE } from '../consts/constants';

export const TodoFilters: React.FC = () => {
  const { filterBy, setFilterBy } = useContext(TodoContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        onClick={() => setFilterBy(FILTER_TYPE.ALL)}
        className={`filter__link ${filterBy === FILTER_TYPE.ALL ? 'selected' : ''}`}
        data-cy="FilterLinkAll"
      >
        All
      </a>

      <a
        href="#/active"
        className={`filter__link ${filterBy === FILTER_TYPE.ACTIVE ? 'selected' : ''}`}
        onClick={() => setFilterBy(FILTER_TYPE.ACTIVE)}
        data-cy="FilterLinkActive"
      >
        Active
      </a>

      <a
        href="#/completed"
        className={`filter__link ${filterBy === FILTER_TYPE.COMPLETED ? 'selected' : ''}`}
        onClick={() => setFilterBy(FILTER_TYPE.COMPLETED)}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
