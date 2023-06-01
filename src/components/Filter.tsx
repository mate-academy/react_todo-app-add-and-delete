import cn from 'classnames';
import { FilterType } from '../types/FilterType';

interface FilterProps {
  filter: string,
  onFilterChange: (filter: FilterType) => void;
}

export const Filter: React.FC<FilterProps> = ({
  filter,
  onFilterChange,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filter === FilterType.All,
        })}
        onClick={() => onFilterChange(FilterType.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filter === FilterType.Active,
        })}
        onClick={() => onFilterChange(FilterType.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === FilterType.Completed,
        })}
        onClick={() => onFilterChange(FilterType.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
