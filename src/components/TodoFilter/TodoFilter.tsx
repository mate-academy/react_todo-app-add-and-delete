import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';

interface Props {
  selectedFilter: FilterType;
  onFilterChange: (s: FilterType) => void;
}

export const TodoFilter: React.FC<Props> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const handleClickOnFilterItem = (filter: FilterType) => {
    onFilterChange(filter);
  };

  return (
    <>
      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          onClick={() => handleClickOnFilterItem(FilterType.All)}
          href="#/"
          className={classNames('filter__link', {
            selected: selectedFilter === FilterType.All,
          })}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          onClick={() => handleClickOnFilterItem(FilterType.Active)}
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedFilter === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          onClick={() => handleClickOnFilterItem(FilterType.Completed)}
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedFilter === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>
    </>
  );
};
