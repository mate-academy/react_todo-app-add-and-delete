import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import { StatusFilterOptions } from '../types/StatusFilterOptions';

interface FilterByStatusProps {
  statusFilter: StatusFilterOptions;
  onStatusFilterChange: Dispatch<SetStateAction<StatusFilterOptions>>;
}

export const FilterByStatus = ({
  statusFilter,
  onStatusFilterChange,
}: FilterByStatusProps) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.entries(StatusFilterOptions).map(([text, value]) => (
        <a
          key={value}
          href={`#/${value !== 'all' ? value : ''}`}
          className={classNames('filter__link', {
            selected: statusFilter === value,
          })}
          data-cy={`FilterLink${text}`}
          onClick={() => onStatusFilterChange(value)}
        >
          {text}
        </a>
      ))}
    </nav>
  );
};
