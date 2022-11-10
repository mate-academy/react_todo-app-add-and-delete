import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../../../utils/enums/FilterType';

type Props = {
  filterType: FilterType;
  onFilter: (filterType: FilterType) => void;
};

export const Navigation: React.FC<Props> = ({ filterType, onFilter }) => (
  <nav className="filter" data-cy="Filter">
    <a
      data-cy="FilterLinkAll"
      href="#/"
      className={classNames(
        'filter__link',
        { selected: filterType === FilterType.All },
      )}
      onClick={() => onFilter(FilterType.All)}
    >
      All
    </a>

    <a
      data-cy="FilterLinkActive"
      href="#/active"
      className={classNames(
        'filter__link',
        { selected: filterType === FilterType.Active },
      )}
      onClick={() => onFilter(FilterType.Active)}
    >
      Active
    </a>
    <a
      data-cy="FilterLinkCompleted"
      href="#/completed"
      className={classNames(
        'filter__link',
        { selected: filterType === FilterType.Completed },
      )}
      onClick={() => onFilter(FilterType.Completed)}
    >
      Completed
    </a>
  </nav>
);
