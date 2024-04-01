import React from 'react';
import cn from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';
import { useTodos } from '../TodosProvider';

export const Filter: React.FC = () => {
  const { filterStatus, setFilterStatus } = useTodos();

  return (
    <>
      {Object.values(FilterStatus).map(status => (
        <nav className="filter" data-cy="Filter" key={status}>
          <a
            href={`#/${status}`}
            className={`filter__link ${cn({
              selected: filterStatus === status,
            })}`}
            data-cy={`FilterLink${status.charAt(0).toUpperCase() + status.slice(1)}`}
            onClick={() => setFilterStatus(status as FilterStatus)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </a>
        </nav>
      ))}
    </>
  );
};
