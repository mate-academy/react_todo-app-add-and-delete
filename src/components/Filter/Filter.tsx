import classNames from 'classnames';
import { FilterStatus } from '../../types/Filter';

type Props = {
  filterStatus: FilterStatus
  onFilter: (filterStatus: FilterStatus) => void;
};

export const Filter: React.FC<Props> = ({ filterStatus, onFilter }) => {
  const handleFilter = (newFilterStatus: FilterStatus) => {
    if (filterStatus !== newFilterStatus) {
      onFilter(newFilterStatus);
    }
  };

  const handleFilterAll = () => {
    handleFilter('all');
  };

  const handleFilterActive = () => {
    handleFilter('active');
  };

  const handleFilterCompleted = () => {
    handleFilter('completed');
  };


  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filterStatus === 'all' },
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
          { selected: filterStatus === 'active' },
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
          { selected: filterStatus === 'completed' },
        )}
        onClick={handleFilterCompleted}
      >
        Completed
      </a>
    </nav>
  );
};
