import cn from 'classnames';
import { Filter } from '../../utils/Filter';

interface Props {
  onFilterChange: (filter: Filter) => void;
  selectedFilter: Filter;
}

export const TodoFilter: React.FC<Props> = ({
  onFilterChange,
  selectedFilter,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: selectedFilter === Filter.All,
        })}
        onClick={() => onFilterChange(Filter.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: selectedFilter === Filter.Active,
        })}
        onClick={() => onFilterChange(Filter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: selectedFilter === Filter.Completed,
        })}
        onClick={() => onFilterChange(Filter.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
