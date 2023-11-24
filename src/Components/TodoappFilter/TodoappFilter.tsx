import React from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  filterBy: Filter,
  onFilterClick: (value: Filter) => void;
};

export const TodoappFilter: React.FC<Props> = ({
  filterBy,
  onFilterClick,
}) => {
  return (
    // {/* // Active filter should have a 'selected' class */}
    <nav className="filter" data-cy="Filter">
      {Object.values(Filter).map(option => (
        <a
          key={option}
          href={`#/${Filter.ALL ? '' : option.toLowerCase()}`}
          className={cn('filter__link', {
            selected: option === filterBy,
          })}
          data-cy={`FilterLink${option}`}
          onClick={() => onFilterClick(option)}
        >
          {option}
        </a>
      ))}
    </nav>
  );
};
