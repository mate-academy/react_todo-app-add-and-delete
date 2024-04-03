import React from 'react';
import classNames from 'classnames';

import { FilterOptions } from '../../types/FilterOptions';

type Props = {
  filterOption: FilterOptions;
  onFilter: (value: FilterOptions) => void;
  optionName: FilterOptions;
};

export const FilterOption: React.FC<Props> = ({
  filterOption,
  onFilter,
  optionName,
}) => {
  return (
    <a
      href={`#/${optionName}`}
      className={classNames('filter__link', {
        selected: filterOption === optionName,
      })}
      data-cy={`FilterLink${optionName}`}
      onClick={() => onFilter(optionName)}
    >
      {optionName}
    </a>
  );
};
