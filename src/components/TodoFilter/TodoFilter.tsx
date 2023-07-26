import React from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  filter: FilterType;
};

export const TodoFilter: React.FC<Props> = ({ filter, setFilter }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link',
          { selected: filter === FilterType.All })}
        onClick={() => setFilter(FilterType.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link',
          { selected: filter === FilterType.Active })}
        onClick={() => setFilter(FilterType.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link',
          { selected: filter === FilterType.Completed })}
        onClick={() => setFilter(FilterType.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
