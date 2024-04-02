import React from 'react';
import cn from 'classnames';

import { Status } from '../types/Status';

type Props = {
  currentFilterStatus: Status;
  onFilter: (value: Status) => void;
};

export const Filter: React.FC<Props> = ({ currentFilterStatus, onFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(Status).map(field => (
        <a
          key={field}
          onClick={() => onFilter(field)}
          href="#/"
          className={cn('filter__link', {
            selected: field === currentFilterStatus,
          })}
          data-cy={`FilterLink${field}`}
        >
          {field}
        </a>
      ))}
    </nav>
  );
};
