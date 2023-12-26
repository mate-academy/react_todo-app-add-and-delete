import React, { useState } from 'react';
import cn from 'classnames';
import { FilterBy } from '../../types/types';

type Props = {
  getFilter: (arg: FilterBy) => void;
};

export const Filter: React.FC<Props> = ({ getFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterBy>(FilterBy.All);

  const handleOnClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const value = e.currentTarget.getAttribute('href')?.replace('#/', '') || '';

    setSelectedFilter(value as FilterBy);
    getFilter(value as FilterBy);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn(
          'filter__link',
          { selected: selectedFilter === FilterBy.All },
        )}
        data-cy="FilterLinkAll"
        onClick={handleOnClick}
      >
        {FilterBy.All}
      </a>

      <a
        href="#/active"
        className={cn(
          'filter__link',
          { selected: selectedFilter === FilterBy.Active },
        )}
        data-cy="FilterLinkActive"
        onClick={handleOnClick}
      >
        {FilterBy.Active}
      </a>

      <a
        href="#/completed"
        className={cn(
          'filter__link',
          { selected: selectedFilter === FilterBy.Completed },
        )}
        data-cy="FilterLinkCompleted"
        onClick={handleOnClick}
      >
        {FilterBy.Completed}
      </a>
    </nav>
  );
};
