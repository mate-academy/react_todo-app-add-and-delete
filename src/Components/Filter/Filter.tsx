import React from 'react';
import { Filters } from '../../types/Filters';
import cn from 'classnames';

type Props = {
  selectedStatus: Filters;
  onSelectedStatus: (selectedStatus: Filters) => void;
};

export const Filter: React.FC<Props> = ({
  selectedStatus,
  onSelectedStatus,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.entries(Filters).map(([key, value]) => (
        <a
          key={value}
          href={value === Filters.All ? '#/' : `#/${value}`}
          className={cn('filter__link', {
            selected: selectedStatus === value,
          })}
          data-cy={`FilterLink${key}`}
          onClick={() => onSelectedStatus(value)}
        >
          {key}
        </a>
      ))}
    </nav>
  );
};
