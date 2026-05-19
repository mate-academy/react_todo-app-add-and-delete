import cn from 'classnames';

import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
};

export const Filter: React.FC<Props> = ({ filterStatus, setFilterStatus }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filterStatus === 'all',
        })}
        data-cy="FilterLinkAll"
        onClick={() => setFilterStatus('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filterStatus === 'active',
        })}
        data-cy="FilterLinkActive"
        onClick={() => setFilterStatus('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filterStatus === 'completed',
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilterStatus('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
