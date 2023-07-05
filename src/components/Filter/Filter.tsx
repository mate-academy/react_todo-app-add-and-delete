import React from 'react';
import classNames from 'classnames';
import { StatusFilter } from '../../types/StatusFilter';

interface Props {
  setSelectedFilter: (filter: StatusFilter) => void;
  selectedFilter: StatusFilter;
}

export const Filter: React.FC<Props> = ({
  setSelectedFilter,
  selectedFilter,
}) => {
  const filters = Object.values(StatusFilter);

  const handleFilterChange = (filter: StatusFilter) => {
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
