import React, { useContext } from 'react';
import classNames from 'classnames';
import { Filter } from '../../enums/Filter';
import { FilterContext } from '../FilterContext';

export const Nav: React.FC = () => {
  const { selectedFilterStatus, setFilterStatus } = useContext(FilterContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: selectedFilterStatus === Filter.All },
        )}
        onClick={() => setFilterStatus(Filter.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: selectedFilterStatus === Filter.Active },
        )}
        onClick={() => {setFilterStatus(Filter.Active)}}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: selectedFilterStatus === Filter.Completed },
        )}
        onClick={() => setFilterStatus(Filter.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
