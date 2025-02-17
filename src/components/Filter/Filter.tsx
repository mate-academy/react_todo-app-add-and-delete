import React, { useContext } from 'react';
import {
  ACTIONSINFILTERCONTEXT,
  FilterContext,
} from '../../contexts/FilterContext';

export const Filter: React.FC = () => {
  const { currentFilterCriteria, setFilterCriteria } =
    useContext(FilterContext)!;

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${currentFilterCriteria === ACTIONSINFILTERCONTEXT.ALL ? 'selected' : ''}`}
        data-cy="FilterLinkAll"
        onClick={() => setFilterCriteria(ACTIONSINFILTERCONTEXT.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={`filter__link ${currentFilterCriteria === ACTIONSINFILTERCONTEXT.ACTIVE ? 'selected' : ''}`}
        data-cy="FilterLinkActive"
        onClick={() => setFilterCriteria(ACTIONSINFILTERCONTEXT.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={`filter__link ${currentFilterCriteria === ACTIONSINFILTERCONTEXT.COMPLETED ? 'selected' : ''}`}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilterCriteria(ACTIONSINFILTERCONTEXT.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
