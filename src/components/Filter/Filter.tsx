import React from 'react';
import classNames from 'classnames';
import { FilterParams } from './FilterParams';

type Props = {
  setFilterParam: (param: FilterParams) => void
  filterParam: FilterParams
};

export const Filter: React.FC<Props>
= ({
  setFilterParam: setFilterParamHandler,
  filterParam = FilterParams.All,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filterParam === FilterParams.All },
        )}
        onClick={() => setFilterParamHandler(FilterParams.All)}

      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filterParam === FilterParams.Active },
        )}
        onClick={() => setFilterParamHandler(FilterParams.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filterParam === FilterParams.Completed },
        )}
        onClick={() => setFilterParamHandler(FilterParams.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
