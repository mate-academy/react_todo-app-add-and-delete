import classNames from 'classnames';
import { FC, memo } from 'react';
import { FilterOptions } from '../../types/FilterOptions';

interface Props {
  onFilterChange: React.Dispatch<React.SetStateAction<FilterOptions>>,
  currentFilter: FilterOptions,
}

const filtersList = Object.values(FilterOptions)
  .filter(key => typeof key !== 'number');

export const Filter: FC<Props> = memo(
  ({ onFilterChange, currentFilter }) => {
    return (
      <>
        <nav className="filter" data-cy="Filter">
          {filtersList.map(filterOption => (
            <a
              key={filterOption}
              data-cy={`FilterLink${filterOption}`}
              href="#/"
              className={classNames(
                'filter__link',
                { selected: filterOption === FilterOptions[currentFilter] },
              )}
              onClick={() => onFilterChange(
                FilterOptions[filterOption],
              )}
            >
              {filterOption}
            </a>

          ))}
        </nav>
      </>
    );
  },
);
