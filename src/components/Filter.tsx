import classNames from 'classnames';
import { StatusFilter } from '../types/StatusFilter';

type Props = {
  statusFilter: StatusFilter;
  setStatusFilter: React.Dispatch<React.SetStateAction<StatusFilter>>;
};

export const Filter: React.FC<Props> = ({ statusFilter, setStatusFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: statusFilter === StatusFilter.ALL,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setStatusFilter(StatusFilter.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: statusFilter === StatusFilter.ACTIVE,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setStatusFilter(StatusFilter.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: statusFilter === StatusFilter.COMPLETED,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setStatusFilter(StatusFilter.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
