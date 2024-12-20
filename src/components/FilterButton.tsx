import React from 'react';
import cn from 'classnames';
import { Filters } from '../types/Filtres';

type Props = {
  filterItem: Filters;
  setCurrentFilter: (filter: Filters) => void;
  currentFilter: Filters;
};

export const FilterButton: React.FC<Props> = props => {
  const { filterItem, currentFilter, setCurrentFilter } = props;

  const isSelectedFilter = currentFilter === filterItem;
  const handleFilterClick = () => {
    if (!isSelectedFilter) {
      setCurrentFilter(filterItem);
    }
  };

  return (
    <a
      href={`#/${filterItem === Filters.All ? '' : filterItem.toLowerCase()}`}
      className={cn('filter__link', { selected: currentFilter === filterItem })}
      data-cy={`FilterLink${filterItem}`}
      onClick={handleFilterClick}
    >
      {filterItem}
    </a>
  );
};
