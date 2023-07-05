import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';

interface Props {
  setSelectedFilter: React.Dispatch<React.SetStateAction<FilterStatus>>;
  selectedFilter: string;
}

export const Filter: React.FC<Props> = ({
  setSelectedFilter,
  selectedFilter,
}) => {
  const filters = Object.values(FilterStatus);

  const handleFilterChange = (filter: FilterStatus) => {
    setSelectedFilter(filter);
  };

  return (
    <nav className="filter">
      {filters.map(filter => (
        <a
          key={filter}
          href="#/"
          className={classNames('filter__link', {
            selected: filter === selectedFilter,
          })}
          onClick={() => handleFilterChange(filter)}
        >
          {filter}
        </a>
      ))}
    </nav>
  );
};
