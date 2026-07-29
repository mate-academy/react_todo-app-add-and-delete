import React from 'react';
import { Status } from '../../types/Status';

type Props = {
  status: Status;
  onStatusChange: (status: Status) => void;
};

export const TodoFilter: React.FC<Props> = ({ status, onStatusChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(Status).map(filterStatus => (
        <a
          key={filterStatus}
          href={
            filterStatus === Status.All
              ? '#/'
              : `#/${filterStatus.toLowerCase()}`
          }
          className={`filter__link ${status === filterStatus ? 'selected' : ''}`}
          data-cy={`FilterLink` + filterStatus}
          onClick={() => onStatusChange(filterStatus)}
        >
          {filterStatus}
        </a>
      ))}
    </nav>
  );
};
