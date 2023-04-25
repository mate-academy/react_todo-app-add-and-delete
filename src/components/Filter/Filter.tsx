import React from 'react';
import classNames from 'classnames';
import { FilterParams } from './FilterParams';

type Props = {
  setFilterParamHandler: (param: FilterParams) => void
  filterParam: FilterParams
};

export const Filter: React.FC<Props>
= ({ setFilterParamHandler, filterParam }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filterParam === FilterParams.all },
        )}
        onClick={() => setFilterParamHandler(FilterParams.all)}

      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filterParam === FilterParams.active },
        )}
        onClick={() => setFilterParamHandler(FilterParams.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filterParam === FilterParams.completed },
        )}
        onClick={() => setFilterParamHandler(FilterParams.completed)}
      >
        Completed
      </a>
    </nav>
  );
};
