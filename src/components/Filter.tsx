import React from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';

const FILTERS = [
  { status: Status.All, href: '#/' },
  { status: Status.Active, href: '#/active' },
  { status: Status.Completed, href: '#/completed' },
];

type Props = {
  status: Status;
  onStatusChange: (status: Status) => void;
};

export const Filter: React.FC<Props> = ({ status, onStatusChange }) => (
  <nav className="filter" data-cy="Filter">
    {FILTERS.map(({ status: filterStatus, href }) => (
      <a
        key={filterStatus}
        href={href}
        className={classNames('filter__link', {
          selected: status === filterStatus,
        })}
        data-cy={`FilterLink${filterStatus}`}
        onClick={() => onStatusChange(filterStatus)}
      >
        {filterStatus}
      </a>
    ))}
  </nav>
);
