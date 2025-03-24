import React from 'react';

import { FilterType } from '../../types/FilterType';
import { FilterOption } from '../FilterOption';

type Props = {
  activeFilter: string;
  setActiveFilter: (filter: FilterType) => void;
};

export const Filter: React.FC<Props> = ({ activeFilter, setActiveFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(FilterType).map(type => (
        <FilterOption
          key={type}
          filterBy={type}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      ))}
    </nav>
  );
};
