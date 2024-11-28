import React from 'react';

import cn from 'classnames';
import { Filters } from '../types/Todo';

type Props = {
  activeFilter: Filters;
  setActiveFilter: (filter: Filters) => void;
  filterItem: Filters;
};

const FilterButton: React.FC<Props> = ({
  activeFilter,
  setActiveFilter,
  filterItem,
}) => {
  const isSelectedFilter = activeFilter === filterItem;
  const filterName = filterItem.charAt(0).toUpperCase() + filterItem.slice(1);
  const handleFilterClick = () => {
    if (!isSelectedFilter) {
      setActiveFilter(filterItem);
    }
  };

  return (
    <a
      key={filterItem}
      href={`#/${filterItem}`}
      className={cn('filter__link', {
        selected: isSelectedFilter,
      })}
      data-cy={`FilterLink${filterName}`}
      onClick={handleFilterClick}
    >
      {filterName}
    </a>
  );
};

export default FilterButton;
