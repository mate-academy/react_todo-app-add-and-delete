import React from 'react';
import classnames from 'classnames';
import { Status } from '../types/Status';

interface FilterProps {
  currentFilterStatus: Status;
  onFilter: (status: Status) => void;
}

export const Filter: React.FC<FilterProps> = ({
  currentFilterStatus,
  onFilter,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(Status).map(field => (
        <a
          key={field}
          onClick={() => onFilter(field)}
          href="#/"
          className={classnames('filter__link', {
            selected: field === currentFilterStatus,
          })}
          data-cy={`FilterLink${field}`}
        >
          {field.toUpperCase()}
        </a>
      ))}
    </nav>
  );
};
