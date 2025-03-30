import cn from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

interface Props {
  filterStatus: FilterStatus;
  handleFilterChange: (status: FilterStatus) => void;
}

export const Filter: React.FC<Props> = ({
  filterStatus,
  handleFilterChange,
}) => (
  <nav className="filter" data-cy="Filter">
    {(Object.values(FilterStatus) as FilterStatus[]).map(status => (
      <a
        key={status}
        href={`#/${status.toLowerCase()}`}
        className={cn('filter__link', { selected: filterStatus === status })}
        data-cy={`FilterLink${status.charAt(0).toUpperCase() + status.slice(1)}`}
        onClick={event => {
          event.preventDefault();
          handleFilterChange(status);
        }}
      >
        {status}
      </a>
    ))}
  </nav>
);

export default Filter;
