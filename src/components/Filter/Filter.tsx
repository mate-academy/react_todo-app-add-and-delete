import React, { memo } from 'react';
import cn from 'classnames';

import { FilterType } from '../../types/FilterType';

type Props = {
  filterType: FilterType;
  onChangeType: React.Dispatch<React.SetStateAction<FilterType>>;
};

export const Filter: React.FC<Props> = memo((props) => {
  const { filterType, onChangeType } = props;

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={cn(
          'filter__link',
          { selected: filterType === FilterType.All },
        )}
        onClick={() => onChangeType(FilterType.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={cn(
          'filter__link',
          { selected: filterType === FilterType.Active },
        )}
        onClick={() => onChangeType(FilterType.Active)}
      >
        Active
      </a>

      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={cn(
          'filter__link',
          { selected: filterType === FilterType.Completed },
        )}
        onClick={() => onChangeType(FilterType.Completed)}
      >
        Completed
      </a>
    </nav>
  );
});
