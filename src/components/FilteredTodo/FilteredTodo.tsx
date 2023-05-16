import cn from 'classnames';
import { Filter } from '../../types/Filter';

interface Props {
  filter: Filter;
  onFilterChange: (status: Filter) => void;
}

export const FilteredTodo: React.FC<Props> = ({ filter, onFilterChange }) => (
  <nav className="filter">
    <a
      href="#/"
      className={cn('filter__link', {
        selected: filter === Filter.ALL,
      })}
      onClick={() => onFilterChange(Filter.ALL)}
    >
      All
    </a>

    <a
      href="#/active"
      className={cn('filter__link', {
        selected: filter === Filter.ACTIVE,
      })}
      onClick={() => onFilterChange(Filter.ACTIVE)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={cn('filter__link', {
        selected: filter === Filter.COMPLETED,
      })}
      onClick={() => onFilterChange(Filter.COMPLETED)}
    >
      Completed
    </a>
  </nav>
);
