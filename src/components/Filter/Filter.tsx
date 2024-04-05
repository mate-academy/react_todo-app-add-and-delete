import React from 'react';

import { FilterOptions } from '../../types/FilterOptions';
import { FilterOption } from '../FilterOption/FilterOption';

type Props = {
  filterOption: FilterOptions;
  onFilter: (value: FilterOptions) => void;
};

export const Filter: React.FC<Props> = ({ filterOption, onFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(FilterOptions).map(option => {
        return (
          <FilterOption
            key={option}
            filterOption={filterOption}
            onFilter={onFilter}
            optionName={option}
          />
        );
      })}
    </nav>
  );
};
