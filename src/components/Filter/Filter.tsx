import classNames from 'classnames';
import { Filters } from '../../types/Filters';

type Props = {
  currentFilter: Filters;
  onFilterChange: (filter: Filters) => void;
};

export const Filter: React.FC<Props> = ({ currentFilter, onFilterChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(Filters).map(filter => (
        <a
          key={filter}
          href={`#/${filter}`}
          className={classNames('filter__link', {
            selected: currentFilter === filter,
          })}
          data-cy={`FilterLink${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </a>
      ))}
    </nav>
  );
};
