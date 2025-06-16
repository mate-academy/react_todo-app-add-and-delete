import { FilterType } from '../../types/Filter';
import classNames from 'classnames';
import React from 'react';

interface FilterProps {
  setFilterStyle: (style: FilterType) => void;
  filterStyle: FilterType;
}

export const Filter: React.FC<FilterProps> = ({
  setFilterStyle,
  filterStyle,
}) => {
  const handleFilterLink = (style: FilterType) => {
    setFilterStyle(style);
  };

  const filterKey = Object.keys(FilterType);

  return (
    <nav className="filter" data-cy="Filter">
      {filterKey.map(style => (
        <a
          key={style}
          href="#/"
          className={classNames('filter__link', {
            selected:
              filterStyle === FilterType[style as keyof typeof FilterType],
          })}
          data-cy={`FilterLink${style}`}
          onClick={() =>
            handleFilterLink(FilterType[style as keyof typeof FilterType])
          }
        >
          {style}
        </a>
      ))}
    </nav>
  );
};
