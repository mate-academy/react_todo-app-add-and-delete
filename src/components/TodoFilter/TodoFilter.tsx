import React from 'react';
import classNames from 'classnames';
import { SortType } from '../../types/SortType';

type Props = {
  sort: SortType;
  setSort: (newSort: SortType) => void;
};

export const TodoFilter: React.FC<Props> = ({ sort, setSort }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: sort === SortType.All,
        })}
        onClick={() => setSort(SortType.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: sort === SortType.Active,
        })}
        onClick={() => setSort(SortType.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: sort === SortType.Completed,
        })}
        onClick={() => setSort(SortType.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
