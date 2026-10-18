import React from 'react';
import classNames from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { FilterStatus } from '../types/FilterStatus';

const FILTERS = [
  { status: FilterStatus.All, label: 'All', href: '#/', cy: 'FilterLinkAll' },
  {
    status: FilterStatus.Active,
    label: 'Active',
    href: '#/active',
    cy: 'FilterLinkActive',
  },
  {
    status: FilterStatus.Completed,
    label: 'Completed',
    href: '#/completed',
    cy: 'FilterLinkCompleted',
  },
];

interface Props {
  filter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
}

export const Filter: React.FC<Props> = ({ filter, onFilterChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {FILTERS.map(({ status, label, href, cy }) => (
        <a
          key={status}
          href={href}
          data-cy={cy}
          className={classNames('filter__link', {
            selected: filter === status,
          })}
          onClick={() => onFilterChange(status)}
        >
          {label}
        </a>
      ))}
    </nav>
  );
};

Filter.propTypes = {
  filter: PropTypes.oneOf(Object.values(FilterStatus)).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};
