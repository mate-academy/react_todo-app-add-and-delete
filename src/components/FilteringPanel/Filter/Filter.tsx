import classNames from 'classnames';
import React from 'react';

import { useAppContext } from '../../../context/AppContext';

import { FilterValues } from '../../../types/FilterValues';

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const Filter: React.FC = () => {
  const { filter, setFilter } = useAppContext();
  const linkValues = Object.values(FilterValues);

  return (
    <nav className="filter" data-cy="Filter">
      {linkValues.map(value => {
        const lowerCasedValue = value.toLowerCase();
        const capitalizedValue = capitalize(value);

        return (
          <a
            key={value}
            href={value === 'all' ? '#/' : `#/${lowerCasedValue}`}
            className={classNames('filter__link', {
              selected: filter === lowerCasedValue,
            })}
            data-cy={`FilterLink${capitalizedValue}`}
            onClick={() => {
              setFilter(lowerCasedValue as FilterValues);
            }}
          >
            {capitalizedValue}
          </a>
        );
      })}
    </nav>
  );
};
