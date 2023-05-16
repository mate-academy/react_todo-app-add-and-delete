import cn from 'classnames';
import { useContext } from 'react';
import { FilterType } from '../../types/FilterType';
import { FilterContext } from '../../contexts/FilterContext';

export const Filter: React.FC = () => {
  const { filter: filterType, setFilter } = useContext(FilterContext);

  return (
    <nav className="filter">
      {Object.values(FilterType).map(filter => {
        const isDefalutFilter = filter === FilterType.All;
        const lowerFilterString = filter.toLowerCase();

        return (
          <a
            key={filter}
            href={`#/${isDefalutFilter
              ? ''
              : lowerFilterString}`}
            className={cn('filter__link',
              { selected: filterType === filter })}
            onClick={() => setFilter(filter)}
          >
            {filter}
          </a>
        );
      })}
    </nav>
  );
};
