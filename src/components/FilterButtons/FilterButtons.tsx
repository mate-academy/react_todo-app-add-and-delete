import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';

type FilterButtonsProps = {
  filterBy: FilterType;
  onFilter: (filter: FilterType) => void;
};

export const FilterButtons = ({ filterBy, onFilter }: FilterButtonsProps) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterBy === FilterType.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilter(FilterType.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterBy === FilterType.Active,
        })}
        onClick={() => onFilter(FilterType.Active)}
        data-cy="FilterLinkActive"
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterBy === FilterType.Completed,
        })}
        onClick={() => onFilter(FilterType.Completed)}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
