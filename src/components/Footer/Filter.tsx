import cn from 'classnames';
import { FilterTypes } from '../../types/enums';
import React from 'react';

type Props = {
  filterBy: FilterTypes;
  setFilterBy: (filterBy: FilterTypes) => void;
};

export const Filter: React.FC<Props> = ({ filterBy, setFilterBy }) => {
  return (
    <>
      {Object.values(FilterTypes).map(filterType => (
        <nav className="filter" data-cy="Filter" key={filterType}>
          <a
            href="#/"
            className={cn('filter__link', {
              selected: filterBy === filterType,
            })}
            data-cy={`FilterLink${filterType}`}
            onClick={() => setFilterBy(filterType)}
          >
            {filterType}
          </a>
        </nav>
      ))}
    </>
  );
};
