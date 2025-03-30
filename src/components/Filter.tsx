import cn from 'classnames';
import { FilterOptions } from '../types/FilterOptions';

interface Props {
  activeFilter: string;
  handleFilterChange: (string: FilterOptions) => void;
}

export const Filter = ({ activeFilter, handleFilterChange }: Props) => (
  <nav className="filter" data-cy="Filter">
    <a
      href="#/"
      className={cn('filter__link', {
        selected: activeFilter === FilterOptions.ALL,
      })}
      data-cy="FilterLinkAll"
      onClick={() => handleFilterChange(FilterOptions.ALL)}
    >
      {FilterOptions.ALL}
    </a>

    <a
      href="#/active"
      className={cn('filter__link', {
        // eslint-disable-next-line prettier/prettier
        'selected': activeFilter === FilterOptions.ACTIVE,
      })}
      data-cy="FilterLinkActive"
      onClick={() => handleFilterChange(FilterOptions.ACTIVE)}
    >
      {FilterOptions.ACTIVE}
    </a>

    <a
      href="#/completed"
      className={cn('filter__link', {
        // eslint-disable-next-line prettier/prettier
        'selected': activeFilter === FilterOptions.COMPLETED,
      })}
      data-cy="FilterLinkCompleted"
      onClick={() => handleFilterChange(FilterOptions.COMPLETED)}
    >
      {FilterOptions.COMPLETED}
    </a>
  </nav>
);
