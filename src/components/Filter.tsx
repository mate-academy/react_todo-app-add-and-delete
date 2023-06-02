import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';

interface FilterProps {
  onFilterStatusChange: (filterStatus: Status) => void
}

export const Filter = ({ onFilterStatusChange }:FilterProps) => {
  const [filterStatus, setFilterStatus] = useState<Status>('all');

  useEffect(() => {
    onFilterStatusChange(filterStatus);
  }, [filterStatus]);

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterStatus === 'all',
        })}
        onClick={() => setFilterStatus('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterStatus === 'active',
        })}
        onClick={() => setFilterStatus('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterStatus === 'completed',
        })}
        onClick={() => setFilterStatus('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
