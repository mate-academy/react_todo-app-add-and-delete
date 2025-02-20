import React from 'react';

import './Filter.scss';

import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  filterType: FilterType;
  onFilterType: (filterType: FilterType) => void;
};

export const Filter: React.FC<Props> = ({
  filterType,
  onFilterType = () => {},
}) => {
  const handleFilterChange =
    (type: FilterType) => (event: React.MouseEvent) => {
      event.preventDefault();

      onFilterType(type);
    };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filterType === 'all',
        })}
        data-cy="FilterLinkAll"
        onClick={handleFilterChange('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filterType === 'active',
        })}
        data-cy="FilterLinkActive"
        onClick={handleFilterChange('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filterType === 'completed',
        })}
        data-cy="FilterLinkCompleted"
        onClick={handleFilterChange('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
