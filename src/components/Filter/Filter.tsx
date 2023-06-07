import classNames from 'classnames';
import { FilterTypes } from '../../types/FilterTypes';

interface FilterProps {
  currentFilter: string;
  onSelectFilter: (filterType: FilterTypes) => void;
}

export const Filter: React.FC<FilterProps> = ({
  currentFilter,
  onSelectFilter,
}) => {
  const filterTypes = [
    FilterTypes.ALL,
    FilterTypes.ACTIVE,
    FilterTypes.COMPLETED,
  ];

  const handleSelectFilter = (filterType: FilterTypes) => {
    if (currentFilter !== filterType && filterTypes.includes(filterType)) {
      onSelectFilter(filterType);
    }
  };

  return (
    <nav className="filter">
      {filterTypes.map((filter) => {
        const title = filter.charAt(0).toUpperCase() + filter.slice(1);

        return (
          <a
            key={filter}
            href={filter === FilterTypes.ALL ? '#/' : `#/${filter}`}
            className={classNames('filter__link',
              { selected: currentFilter === 'all' })}
            onClick={() => handleSelectFilter(filter)}
          >
            {title}
          </a>
        );
      })}
    </nav>
  );
};
