import React from 'react';

export enum FilterTypes {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  onFilterType: (type: FilterTypes) => void
};

export const TodoFilter: React.FC<Props> = ({
  onFilterType,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className="filter__link"
        onClick={() => onFilterType(FilterTypes.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className="filter__link"
        onClick={() => onFilterType(FilterTypes.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className="filter__link"
        onClick={() => onFilterType(FilterTypes.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
