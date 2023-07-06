import classNames from 'classnames';
import React from 'react';

export enum FilterTypes {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  onFilterType: (type: FilterTypes) => void
  filter: FilterTypes
};

export const TodoFilter: React.FC<Props> = ({
  onFilterType,
  filter,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === FilterTypes.All,
        })}
        onClick={() => onFilterType(FilterTypes.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === FilterTypes.Active,
        })}
        onClick={() => onFilterType(FilterTypes.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === FilterTypes.Completed,
        })}
        onClick={() => onFilterType(FilterTypes.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
