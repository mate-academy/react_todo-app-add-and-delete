import cn from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  filter: Filter;
  onFilterChange: (newFilter: Filter) => void;
};

export const TodoFilterPanel: React.FC<Props> = ({
  filter,
  onFilterChange = () => {},
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href={`#/${Filter.All}`}
        className={cn('filter__link', { selected: filter === Filter.All })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterChange(Filter.All)}
      >
        All
      </a>

      <a
        href={`#/${Filter.Active}`}
        className={cn('filter__link', { selected: filter === Filter.Active })}
        data-cy="FilterLinkActive"
        onClick={() => onFilterChange(Filter.Active)}
      >
        Active
      </a>

      <a
        href={`#/${Filter.Completed}`}
        className={cn('filter__link', {
          selected: filter === Filter.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onFilterChange(Filter.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
