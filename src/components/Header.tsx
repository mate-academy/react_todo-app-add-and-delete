import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../types/FilterType';

type Props = {
  filter: string;
  onFilterChange: (filter: string) => void;
};

export const Header: React.FC<Props> = ({ filter, onFilterChange }) => {
  return (
    <header className="todoapp__header">
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(filt => (
          <a
            key={filt}
            href={`#/${filt}`}
            className={classNames('filter__link', {
              selected: filter === filt,
            })}
            data-cy={`FilterLink${filt.charAt(0).toUpperCase() + filt.slice(1)}`}
            onClick={() => onFilterChange(filt)}
          >
            {filt.charAt(0).toUpperCase() + filt.slice(1)}
          </a>
        ))}
      </nav>
    </header>
  );
};
