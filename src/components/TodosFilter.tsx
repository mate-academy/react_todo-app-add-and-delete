import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
};

export const TodosFilter: React.FC<Props> = ({
  filterStatus,
  setFilterStatus,
}) => {
  const statuses = Object.values(FilterStatus);

  return (
    <nav className="filter">
      {statuses.map((status) => (
        <a
          key={status}
          href={`#/${status === 'all' ? '' : status}`}
          className={classNames('filter__link', {
            selected: status === filterStatus,
          })}
          onClick={() => setFilterStatus(status)}
        >
          {status[0].toUpperCase() + status.slice(1)}
        </a>
      ))}
    </nav>
  );
};
