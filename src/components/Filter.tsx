import React from 'react';
import { FilterOptions } from '../types/FilterOptions';
import classNames from 'classnames';
import { useTodos } from '../utils/TodoContext';

const filterOptionsArray = Object.values(FilterOptions);

export const Filter: React.FC = () => {
  const { filter, setFilter } = useTodos();

  return (
    <nav className="filter" data-cy="Filter">
      {filterOptionsArray.map(option => (
        <a
          key={option}
          href="#/"
          className={classNames('filter__link', {
            selected: filter === option,
          })}
          data-cy={`FilterLink${option}`}
          onClick={() => setFilter(option)}
        >
          {option}
        </a>
      ))}
    </nav>
  );
};
