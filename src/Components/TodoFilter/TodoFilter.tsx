import { FC } from 'react';
import cn from 'classnames';
import { FilterOption } from '../../enums/FilterOption';

interface Props {
  filterOption: FilterOption;
  setFilterOption: (filterOption: FilterOption) => void;
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
          selected: filterOption === FilterOption.All,
        })}
        onClick={() => setFilterOption(FilterOption.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filterOption === FilterOption.Active,
        })}
        onClick={() => setFilterOption(FilterOption.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filterOption === FilterOption.Completed,
        })}
        onClick={() => setFilterOption(FilterOption.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
