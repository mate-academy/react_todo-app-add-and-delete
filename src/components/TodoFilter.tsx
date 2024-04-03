import { FC } from 'react';
import { Filter } from '../types';
import { FilterLink } from './FilterLink';

export const TodoFilter: FC = () => {
  const filterMenu = Object.values(Filter);

  return (
    <nav className="filter" data-cy="Filter">
      {filterMenu.map(filterType => (
        <FilterLink key={filterType} filterType={filterType}>
          {filterType}
        </FilterLink>
      ))}
    </nav>
  );
};
