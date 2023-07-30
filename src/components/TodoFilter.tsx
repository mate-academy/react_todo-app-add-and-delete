import React from 'react';
import classNames from 'classnames';
import { FilterChoise } from '../types/FilterChoise';

type Props = {
  filterChoise: FilterChoise;
  setFilterChoise: (status: FilterChoise) => void;
};

export const TodoFilter: React.FC<Props> = ({
  filterChoise,
  setFilterChoise,
}) => {
  const choises = Object.values(FilterChoise);

  return (
    <nav className="filter">
      {choises.map((choise) => (
        <a
          key={choise}
          href={`#/${choise === 'all' ? '' : choise}`}
          className={classNames('filter__link', {
            selected: choise === filterChoise,
          })}
          onClick={() => setFilterChoise(choise)}
        >
          {choise[0].toUpperCase() + choise.slice(1)}
        </a>
      ))}
    </nav>
  );
};
