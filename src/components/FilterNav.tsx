import classNames from 'classnames';
import React from 'react';
import { Filter } from '../types/Filter';

type FilterNavProps = {
  filter: Filter,
  setFilter: React.Dispatch<React.SetStateAction<Filter>>,
};

export const FilterNav: React.FC<FilterNavProps> = ({
  filter, setFilter,
}) => {
  const handleFilterChange = (
    option: Filter, event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setFilter(option);
  };

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames(
          'filter__link', { selected: filter === Filter.All },
        )}
        onClick={(event) => handleFilterChange(Filter.All, event)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link', { selected: filter === Filter.Active },
        )}
        onClick={(event) => handleFilterChange(Filter.Active, event)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link', { selected: filter === Filter.Completed },
        )}
        onClick={
          (event) => handleFilterChange(Filter.Completed, event)
        }
      >
        Completed
      </a>
    </nav>
  );
};
