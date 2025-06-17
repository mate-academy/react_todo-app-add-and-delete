import cn from 'classnames';
import { Dispatch, SetStateAction } from 'react';

export enum FilterOptions {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

interface Props {
  statusFiltration: FilterOptions;
  onStatusFilterChange: Dispatch<SetStateAction<FilterOptions>>;
}

export const StatusFilter: React.FC<Props> = ({
  statusFiltration,
  onStatusFilterChange,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.entries(FilterOptions).map(([text, value]) => (
        <a
          key={value}
          href={`#/${value !== 'all' ? value : ''}`}
          className={cn('filter__link', {
            selected: statusFiltration === value,
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
