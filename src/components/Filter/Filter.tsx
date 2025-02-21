import React from 'react';

import './Filter.scss';

import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  filterType: FilterType;
  onFilterType: (filterType: FilterType) => void;
};

export const Filter: React.FC<Props> = ({
  filterType,
  onFilterType = () => {},
}) => {
  const handleFilterChange =
    (type: FilterType) => (event: React.MouseEvent) => {
      event.preventDefault();

      onFilterType(type);
    };

  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(FilterType).map((filter: FilterType) => {
        const displayName = filter.charAt(0).toUpperCase() + filter.slice(1);

        return (
          <a
            key={filter}
            href={`#/${filter.toLowerCase()}`}
            className={cn('filter__link', {
              selected: filterType === filter,
            })}
            data-cy={`FilterLink${displayName}`}
            onClick={handleFilterChange(filter)}
          >
            {displayName}
          </a>
        );
      })}
    </nav>
  );
};
