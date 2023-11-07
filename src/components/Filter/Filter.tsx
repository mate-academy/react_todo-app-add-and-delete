import { FC } from 'react';
import cn from 'classnames';
import { Filters } from '../../types/Filters';

type Props = {
  filter: Filters
  onFilterChange: (value: Filters) => void;
};

export const Filter: FC<Props> = ({ filter, onFilterChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filter === Filters.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterChange(Filters.All)}
      >
        {Filters.All}
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filter === Filters.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onFilterChange(Filters.Active)}
      >
        {Filters.Active}
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === Filters.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onFilterChange(Filters.Completed)}
      >
        {Filters.Completed}
      </a>
    </nav>
  );
};
