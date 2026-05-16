import React from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';

type Props = {
  filter: Status;
  onFilterChange: (status: Status) => void;
};

export const Filter: React.FC<Props> = ({ filter, onFilterChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(Status).map(statusValue => (
        <a
          key={statusValue}
          href={`#/${statusValue === Status.All ? '' : statusValue}`}
          className={classNames('filter__link', {
            selected: filter === statusValue,
          })}
          data-cy={`FilterLink${statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}`}
          onClick={() => onFilterChange(statusValue)}
        >
          {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
        </a>
      ))}
    </nav>
  );
};
