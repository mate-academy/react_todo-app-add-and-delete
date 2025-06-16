import cn from 'classnames';
import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { StatusFilterOptions } from '../../types/StatusFilterOptions';

interface StatusFilterProps {
  statusFilter: StatusFilterOptions;
  onStatusFilter: Dispatch<SetStateAction<StatusFilterOptions>>;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({
  statusFilter,
  onStatusFilter,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.entries(StatusFilterOptions).map(([key, value]) => (
        <a
          key={key}
          href={`#/${key !== 'all' ? key : ''}`}
          className={cn('filter__link', {
            selected: statusFilter === value,
          })}
          data-cy={`FilterLink${value}`}
          onClick={() => onStatusFilter(value)}
        >
          {value}
        </a>
      ))}
    </nav>
  );
};
