import cn from 'classnames';
import { useContext } from 'react';
import { FilterType } from '../../types/FilterType';
import { FilterContext } from '../../contexts/FilterContext';

export const Filter: React.FC = () => {
  const { filterType, setFilterType } = useContext(FilterContext);

  return (
    <nav className="filter">
      {Object.values(FilterType).map(filter => {
        const isDefalutFilter = filter === FilterType.All;
        const lowerFilterString = filter.toLowerCase();
        const filterHref = `#/${isDefalutFilter
          ? ''
          : lowerFilterString}`;

        return (
          <a
            key={filter}
            href={filterHref}
            className={cn('filter__link',
              { selected: filterType === filter })}
            onClick={() => setFilterType(filter)}
          >
            {filter}
          </a>
        );
      })}
    </nav>
  );
};
