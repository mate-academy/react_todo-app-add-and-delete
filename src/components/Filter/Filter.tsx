import classNames from 'classnames';
import React, { MouseEvent, useContext } from 'react';

import { FilterContext } from '../../context/FilterContext';
import { FilterType } from '../../types/SortType';

export const Filter: React.FC = React.memo(
  () => {
    const { filter, setFilter } = useContext(FilterContext);

    const onFilterChange = (value: string) => {
      switch (value) {
        case FilterType.ACTIVE:
          setFilter(FilterType.ACTIVE);
          break;

        case FilterType.COMPLETED:
          setFilter(FilterType.COMPLETED);
          break;

        default:
          setFilter(FilterType.ALL);
      }
    };

    const handlerOnClick = (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const target = event.currentTarget;

      onFilterChange(target.innerText);
    };

    return (
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === FilterType.ALL,
          })}
          onClick={handlerOnClick}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === FilterType.ACTIVE,
          })}
          onClick={handlerOnClick}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === FilterType.COMPLETED,
          })}
          onClick={handlerOnClick}
        >
          Completed
        </a>
      </nav>
    );
  },
);
