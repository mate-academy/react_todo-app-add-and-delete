import classNames from 'classnames';
import React, { MouseEvent, useContext } from 'react';

import { FilterContext } from '../../context/FilterContext';
import { FilterType } from '../../types/SortType';

export const Filter: React.FC = React.memo(
  () => {
    const { filter, setFilter } = useContext(FilterContext);

    const onFilterChange = (value: FilterType) => {
      switch (value) {
        case FilterType.Active:
          setFilter(FilterType.Active);
          break;

        case FilterType.Completed:
          setFilter(FilterType.Completed);
          break;

        default:
          setFilter(FilterType.All);
      }
    };

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const target = event.currentTarget;

      onFilterChange(target.innerText as FilterType);
    };

    return (
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === FilterType.All,
          })}
          onClick={handleClick}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === FilterType.Active,
          })}
          onClick={handleClick}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === FilterType.Completed,
          })}
          onClick={handleClick}
        >
          Completed
        </a>
      </nav>
    );
  },
);
