import React, { memo } from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/Filter';

type Props = {
  filterType: string;
  setFilterType: React.Dispatch<React.SetStateAction<FilterType>>;
};

export const Filter: React.FC<Props> = memo((props) => {
  const { filterType, setFilterType: onChangeFilter } = props;

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={cn(
          'filter__link',
          { selected: filterType === 'All' },
        )}
        onClick={() => onChangeFilter('All')}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={cn(
          'filter__link',
          { selected: filterType === 'Active' },
        )}
        onClick={() => onChangeFilter('Active')}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={cn(
          'filter__link',
          { selected: filterType === 'Completed' },
        )}
        onClick={() => onChangeFilter('Completed')}
      >
        Completed
      </a>
    </nav>
  );
});
