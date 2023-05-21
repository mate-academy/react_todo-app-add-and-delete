import classNames from 'classnames';
import { FC } from 'react';
import { Filter } from '../../types/FilterConditions';

interface Props {
  filterCondition: Filter;
  filterNames: Filter[];
  onChangeFilter: React.Dispatch<React.SetStateAction<Filter>>;
}

export const FilterComponent: FC<Props> = ({
  filterCondition,
  filterNames,
  onChangeFilter,
}) => {
  const handleFilterClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onChangeFilter(event.currentTarget.textContent as Filter);
  };

  return (
    <nav className="filter">
      {filterNames.map(filterName => (
        <a
          key={filterName}
          href={filterName === Filter.All ? '#/' : `#/${filterName}`}
          onClick={handleFilterClick}
          className={classNames('filter__link', {
            selected: filterCondition === filterName,
          })}
        >
          {filterName}
        </a>
      ))}
    </nav>
  );
};
