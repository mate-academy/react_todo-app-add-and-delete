import React from 'react';
import classNames from 'classnames';
import { FilterBy } from '../types/FilterBy';

type Props = {
  filterBy: FilterBy,
  setFilterBy: React.Dispatch<React.SetStateAction<FilterBy>>,
};

const FilterByValues: FilterBy[] = [
  FilterBy.All,
  FilterBy.Active,
  FilterBy.Completed,
];

export const Filter: React.FC<Props> = ({
  filterBy,
  setFilterBy,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {FilterByValues.map(filter => {
        const title = filter[0].toUpperCase() + filter.slice(1);

        return (
          <a
            data-cy="FilterLinkAll"
            href="#/"
            className={classNames(
              'filter__link',
              {
                selected: filterBy === filter,
              },
            )}
            onClick={() => setFilterBy(filter)}
            key={filter}
          >
            {title}
          </a>
        );
      })}
    </nav>
  );
};
