import classNames from 'classnames';
import { Filters } from '../../types/FilterStatus';

type Props = {
  filterStatus: Filters
  onFilter: (filterStatus: Filters) => void;
};

export const Filter: React.FC<Props> = ({ filterStatus, onFilter }) => {
  const handleFilter = (newFilterStatus: Filters) => {
    if (filterStatus !== newFilterStatus) {
      onFilter(newFilterStatus);
    }
  };

  const handleFilterAll = () => {
    handleFilter(Filters.ALL);
  };

  const handleFilterActive = () => {
    handleFilter(Filters.ACTIVE);
  };

  const handleFilterCompleted = () => {
    handleFilter(Filters.COMPLETED);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filterStatus === Filters.ALL },
        )}
        onClick={handleFilterAll}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filterStatus === Filters.ACTIVE },
        )}
        onClick={handleFilterActive}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filterStatus === Filters.COMPLETED },
        )}
        onClick={handleFilterCompleted}
      >
        Completed
      </a>
    </nav>
  );
};
