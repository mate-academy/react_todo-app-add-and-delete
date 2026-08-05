import React from 'react';
import classNames from 'classnames';

export enum TodoStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  status: TodoStatus;
  onStatusChange: (status: TodoStatus) => void;
};

const FILTERS = [
  { status: TodoStatus.All, label: 'All', dataCy: 'FilterLinkAll' },
  { status: TodoStatus.Active, label: 'Active', dataCy: 'FilterLinkActive' },
  {
    status: TodoStatus.Completed,
    label: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFilter: React.FC<Props> = ({ status, onStatusChange }) => (
  <nav className="filter" data-cy="Filter">
    {FILTERS.map(filter => (
      <a
        key={filter.status}
        href={`#/${filter.status === TodoStatus.All ? '' : filter.status}`}
        className={classNames('filter__link', {
          selected: status === filter.status,
        })}
        data-cy={filter.dataCy}
        onClick={() => onStatusChange(filter.status)}
      >
        {filter.label}
      </a>
    ))}
  </nav>
);
