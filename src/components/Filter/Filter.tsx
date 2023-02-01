import classNames from 'classnames';
import React, { memo } from 'react';
import { FilterType } from '../../types/FilterType';

type Props = {
  filterStatus: string;
  onFilterStatus: React.Dispatch<React.SetStateAction<string>>;
};

export const Filter: React.FC<Props> = memo(({
  filterStatus,
  onFilterStatus,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames('filter__link ', {
          selected: filterStatus === FilterType.ALL,
        })}
        onClick={() => onFilterStatus(FilterType.ALL)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames('filter__link ', {
          selected: filterStatus === FilterType.ACTIVE,
        })}
        onClick={() => onFilterStatus(FilterType.ACTIVE)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames('filter__link ', {
          selected: filterStatus === FilterType.COMPLETED,
        })}
        onClick={() => onFilterStatus(FilterType.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
});
