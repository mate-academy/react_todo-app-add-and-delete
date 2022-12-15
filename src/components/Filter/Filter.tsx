import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';

interface Props {
  filter: FilterType,
  onSelectFilter: React.Dispatch<React.SetStateAction<FilterType>>,
}

export const Filter: React.FC<Props> = React.memo(({
  filter, onSelectFilter,
}) => (
  <nav className="filter" data-cy="Filter">
    <a
      data-cy="FilterLinkAll"
      href="#/"
      className={classNames('filter__link',
        { selected: filter === FilterType.ALL })}
      onClick={() => onSelectFilter(FilterType.ALL)}
    >
      All
    </a>

    <a
      data-cy="FilterLinkActive"
      href="#/active"
      className={classNames('filter__link',
        { selected: filter === FilterType.ACTIVE })}
      onClick={() => onSelectFilter(FilterType.ACTIVE)}
    >
      Active
    </a>
    <a
      data-cy="FilterLinkCompleted"
      href="#/completed"
      className={classNames('filter__link',
        { selected: filter === FilterType.COMPLETED })}
      onClick={() => onSelectFilter(FilterType.COMPLETED)}
    >
      Completed
    </a>
  </nav>
));
