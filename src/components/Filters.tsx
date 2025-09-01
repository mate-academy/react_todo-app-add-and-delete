import classNames from 'classnames';
import { FilterType } from '../types/Filter';

interface FilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const Filter: React.FC<FilterProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  const handleFilterClick =
    (filter: FilterType) => (event: React.MouseEvent) => {
      event.preventDefault();
      onFilterChange(filter);
    };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: currentFilter === 'all',
        })}
        data-cy="FilterLinkAll"
        onClick={handleFilterClick('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: currentFilter === 'active',
        })}
        data-cy="FilterLinkActive"
        onClick={handleFilterClick('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: currentFilter === 'completed',
        })}
        data-cy="FilterLinkCompleted"
        onClick={handleFilterClick('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
