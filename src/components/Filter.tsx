import cn from 'classnames';
import { Status } from '../types/Status';
import React from 'react';

type Props = {
  filterStatus: Status;
  setFilterStatus: (filterStatus: Status) => void;
};

export const Filter: React.FC<Props> = ({ filterStatus, setFilterStatus }) => (
  <nav className="filter" data-cy="Filter">
    {Object.values(Status).map(status => {
      const title = status.charAt(0).toUpperCase() + status.slice(1);

      return (
        <a
          key={status}
          href="#/"
          className={cn('filter__link', { selected: filterStatus === status })}
          data-cy={`FilterLink${title}`}
          onClick={() => setFilterStatus(status)}
        >
          {title}
        </a>
      );
    })}
  </nav>
);
