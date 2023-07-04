import React, { Fragment, memo } from 'react';
import cn from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';
import './TodoFilter.scss';

interface TodoFilterProps {
  filterStatus: FilterStatus;
  onFilter: (filterBy: FilterStatus) => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = memo(({
  filterStatus,
  onFilter,
}) => {
  const handleFilterClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    filterByStatus: FilterStatus,
  ) => {
    event.preventDefault();

    onFilter(filterByStatus);
  };

  const filterStatuses = Object
    .keys(FilterStatus) as (keyof typeof FilterStatus)[];

  return (
    <nav className="filter">
      {filterStatuses.map(status => (
        <Fragment key={status}>
          <a
            href={status !== 'all' ? `#/${status}` : '#/'}
            className={cn('filter__link', {
              selected: status === filterStatus,
            })}
            onClick={event => handleFilterClick(event, FilterStatus[status])}
          >
            {status}
          </a>
        </Fragment>
      ))}
    </nav>
  );
});
