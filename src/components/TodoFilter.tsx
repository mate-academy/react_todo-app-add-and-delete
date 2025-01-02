import React from 'react';
import { Filters } from '../types/Filters';
import cn from 'classnames';
import { capitalizeString } from '../utils/capitalizeString';

type Props = {
  currentFilter: Filters;
  setCurrentFilter: (filter: Filters) => void;
};

export const TodoFilter: React.FC<Props> = ({
  currentFilter,
  setCurrentFilter,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(Filters).map(filter => (
        <a
          key={filter}
          href={`#/${filter}`}
          className={cn('filter__link', {
            selected: currentFilter === filter,
          })}
          data-cy={`FilterLink${capitalizeString(filter)}`}
          onClick={() => setCurrentFilter(filter)}
        >
          {capitalizeString(filter)}
        </a>
      ))}
    </nav>
  );
};
