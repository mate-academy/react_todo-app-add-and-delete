import { FC } from 'react';
import cn from 'classnames';
import { FilterOptions } from '../../enums/FilterOptions';

interface Props {
  filterOption: FilterOptions;
  setFilterOption: (filterOption: FilterOptions) => void;
}

export const TodoFilter: FC<Props> = ({
  filterOption,
  setFilterOption,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filterOption === FilterOptions.all,
        })}
        onClick={() => setFilterOption(FilterOptions.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filterOption === FilterOptions.active,
        })}
        onClick={() => setFilterOption(FilterOptions.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filterOption === FilterOptions.completed,
        })}
        onClick={() => setFilterOption(FilterOptions.completed)}
      >
        Completed
      </a>
    </nav>
  );
};
