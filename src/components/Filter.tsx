import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';

interface FilterProps {
  onFilterStatusChange: (filterStatus: Status) => void
}

export const Filter = ({ onFilterStatusChange }:FilterProps) => {
  const [filterStatus, setFilterStatus] = useState<Status>(Status.ALL);

  useEffect(() => {
    onFilterStatusChange(filterStatus);
  }, [filterStatus]);

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterStatus === Status.ALL,
        })}
        onClick={() => setFilterStatus(Status.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterStatus === Status.ACTIVE,
        })}
        onClick={() => setFilterStatus(Status.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterStatus === Status.COMPLETED,
        })}
        onClick={() => setFilterStatus(Status.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
