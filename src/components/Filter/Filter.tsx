import React from 'react';
import cn from 'classnames';

import './Filter.scss';
import { FilterValue } from '../../types/FilterValue';

type Props = {
  filterValue: FilterValue;
  handleFilter: React.Dispatch<React.SetStateAction<FilterValue>>;
};

export const Filter: React.FC<Props> = ({
  filterValue,
  handleFilter,
}) => {
  const makeHandleFilter
    = (sortField: FilterValue) => () => handleFilter(sortField);

  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn(
          'filter__link',
          { selected: filterValue === FilterValue.All },
        )}
        onClick={makeHandleFilter(FilterValue.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn(
          'filter__link',
          { selected: filterValue === FilterValue.Active },
        )}
        onClick={makeHandleFilter(FilterValue.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn(
          'filter__link',
          { selected: filterValue === FilterValue.Completed },
        )}
        onClick={makeHandleFilter(FilterValue.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
