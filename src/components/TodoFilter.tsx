import classNames from 'classnames';
import PropTypes from 'prop-types';
import type { FC, MouseEvent } from 'react';

export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  selectedStatus: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
};

type FilterOption = {
  status: FilterStatus;
  label: string;
  href: string;
  dataCy: string;
};

const filterOptions: FilterOption[] = [
  {
    status: FilterStatus.All,
    label: 'All',
    href: '#/',
    dataCy: 'FilterLinkAll',
  },
  {
    status: FilterStatus.Active,
    label: 'Active',
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    status: FilterStatus.Completed,
    label: 'Completed',
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFilter: FC<Props> = ({ selectedStatus, onStatusChange }) => (
  <nav className="filter" data-cy="Filter">
    {filterOptions.map(({ status, label, href, dataCy }) => (
      <a
        key={status}
        href={href}
        className={classNames('filter__link', {
          selected: selectedStatus === status,
        })}
        data-cy={dataCy}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault();
          onStatusChange(status);
        }}
      >
        {label}
      </a>
    ))}
  </nav>
);

TodoFilter.propTypes = {
  selectedStatus: PropTypes.oneOf(Object.values(FilterStatus)).isRequired,
  onStatusChange: PropTypes.func.isRequired,
};
