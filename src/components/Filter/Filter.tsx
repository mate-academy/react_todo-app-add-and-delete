import React from 'react';
import { FilterType } from '../../types/FilterType';
import classNames from 'classnames';

interface Props {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

export const Filter: React.FC<Props> = ({ filter, setFilter }) => (
  <nav className="filter" data-cy="Filter">
    {Object.values(FilterType).map(status => (
      <a
        key={status}
        href={`#/${status}`}
        className={classNames(
          `filter__link ${filter === status ? 'selected' : ''}`,
        )}
        data-cy={`FilterLink${status.charAt(0).toUpperCase() + status.slice(1)}`}
        onClick={e => {
          e.preventDefault();
          setFilter(status as FilterType);
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </a>
    ))}
  </nav>
);
