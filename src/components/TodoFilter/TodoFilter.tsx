import React from 'react';
import { FiltersEnum } from '../../types/enums/FiltersEnum';
import cn from 'classnames';

interface TodoFilterProps {
  currentFilter: FiltersEnum;
  onFilterChange: (filter: FiltersEnum) => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  currentFilter,
  onFilterChange = () => {},
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: currentFilter === FiltersEnum.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterChange(FiltersEnum.All)}
      >
        All
      </a>

      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={cn('filter__link', {
          selected: currentFilter === FiltersEnum.Active,
        })}
        onClick={() => onFilterChange(FiltersEnum.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: currentFilter === FiltersEnum.Completed,
        })}
        onClick={() => onFilterChange(FiltersEnum.Completed)}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
