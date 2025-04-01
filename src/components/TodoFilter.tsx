import React from 'react';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  filterStatus: FilterStatus;
  onChange: (status: FilterStatus) => void;
};

export const TodoFilter: React.FC<Props> = ({ filterStatus, onChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${filterStatus === FilterStatus.All ? 'selected' : ''}`}
        data-cy="FilterLinkAll"
        onClick={e => {
          e.preventDefault();
          onChange(FilterStatus.All);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={`filter__link ${filterStatus === FilterStatus.Active ? 'selected' : ''}`}
        data-cy="FilterLinkActive"
        onClick={e => {
          e.preventDefault();
          onChange(FilterStatus.Active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={`filter__link ${filterStatus === FilterStatus.Completed ? 'selected' : ''}`}
        data-cy="FilterLinkCompleted"
        onClick={e => {
          e.preventDefault();
          onChange(FilterStatus.Completed);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
