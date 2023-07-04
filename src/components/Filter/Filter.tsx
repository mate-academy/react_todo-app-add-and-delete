import React from 'react';
import classNames from 'classnames';

interface Props {
  setSelectedFilter: (filter: string) => void;
  selectedFilter: string;
}

export const Filter: React.FC<Props> = ({
  setSelectedFilter,
  selectedFilter,
}) => {
  const filters = ['All', 'Active', 'Completed'];

  const handleClickFilter = (filter: string) => {
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
          onClick={() => handleClickFilter(filter)}
        >
          {filter}
        </a>
      ))}
    </nav>
  );
};
