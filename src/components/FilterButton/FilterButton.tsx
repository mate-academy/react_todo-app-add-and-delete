import React, { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';
import { FilterOptions } from '../../types/FilterOptions';

const { All, Active, Completed } = FilterOptions;

const getFilterOption = (filter: string) => {
  switch (filter) {
    case 'Active':
      return Active;
    case 'Completed':
      return Completed;
    default:
      return All;
  }
};

type Props = {
  filter: string,
  onClick: Dispatch<SetStateAction<FilterOptions>>,
  currentFilter: string
};

export const FilterButton: React.FC<Props> = ({
  filter,
  onClick,
  currentFilter,
}) => {
  const Option = getFilterOption(filter);

  return (
    <a
      href="#/"
      className={cn(
        'filter__link',
        { selected: currentFilter === Option },
      )}
      onClick={() => onClick(Option)}
    >
      {filter}
    </a>
  );
};
