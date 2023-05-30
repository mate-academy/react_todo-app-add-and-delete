import React from 'react';
import classNames from 'classnames';
import { SortType } from '../../types/SortType';
import '../../styles/filter.scss';

type Props = {
  sortType: SortType,
  sortBy: {
    sortByAll: () => void,
    sortByActive: () => void,
    sortByCompleted: () => void,
  }
};

export const FilterComponent: React.FC<Props> = ({ sortType, sortBy }) => {
  const {
    sortByAll,
    sortByActive,
    sortByCompleted,
  } = sortBy;

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: sortType === SortType.All,
        })}
        onClick={sortByAll}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: sortType === SortType.Active,
        })}
        onClick={sortByActive}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: sortType === SortType.Completed,
        })}
        onClick={sortByCompleted}
      >
        Completed
      </a>
    </nav>
  );
};
