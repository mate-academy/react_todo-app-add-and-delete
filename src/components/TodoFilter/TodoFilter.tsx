import React, { memo } from 'react';
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

  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn(
          'filter__link', {
            selected: filterStatus === FilterStatus.all,
          },
        )}
        onClick={event => handleFilterClick(event, FilterStatus.all)}
      >
        All
      </a>
      <a
        href="#/active"
        className={cn(
          'filter__link', {
            selected: filterStatus === FilterStatus.active,
          },
        )}
        onClick={(event) => handleFilterClick(event, FilterStatus.active)}
      >
        Active
      </a>
      <a
        href="#/completed"
        className={cn(
          'filter__link', {
            selected: filterStatus === FilterStatus.completed,
          },
        )}
        onClick={(event) => handleFilterClick(event, FilterStatus.completed)}
      >
        Completed
      </a>
    </nav>
  );
});
