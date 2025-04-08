import React from 'react';
import { FilterSelectEnum } from '../../types/FilterSelectType';
import cn from 'classnames';

interface Props {
  option: FilterSelectEnum;
  selectedFilter: FilterSelectEnum;
  onSelectedFilter: (option: FilterSelectEnum) => void;
}

export const FilterSelect: React.FC<Props> = React.memo(
  ({ onSelectedFilter, option, selectedFilter }) => {
    const checkHref =
      option === FilterSelectEnum.All ? '' : option.toLowerCase();

    return (
      <a
        href={`#/${checkHref}`}
        className={cn('filter__link', {
          selected: selectedFilter === option,
        })}
        data-cy={`FilterLink${option}`}
        onClick={() => onSelectedFilter(option)}
      >
        {option}
      </a>
    );
  },
);

FilterSelect.displayName = 'FilterSelect';
