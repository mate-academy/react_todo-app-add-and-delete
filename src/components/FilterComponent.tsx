import React from 'react';
import { Filter as FilterType, FILTERS } from '../types/Filters';
import classNames from 'classnames';

interface FilterProps {
  current: FilterType;
  onChange: (filter: FilterType) => void;
}

export const FilterComponent: React.FC<FilterProps> = ({
  current,
  onChange,
}) => {
  const capitalize = (value: string) => value[0].toUpperCase() + value.slice(1);

  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(FILTERS).map(filter => {
        const label = capitalize(filter);

        return (
          <a
            key={filter}
            href={`#/${filter}`}
            className={classNames('filter__link', {
              selected: current === filter,
            })}
            data-cy={`FilterLink${label}`}
            onClick={event => {
              event.preventDefault();
              onChange(filter);
            }}
          >
            {label}
          </a>
        );
      })}
    </nav>
  );
};
