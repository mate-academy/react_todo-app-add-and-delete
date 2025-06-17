import cn from 'classnames';
import { FilterType } from '../types/ErrorType';
import { Dispatch, SetStateAction } from 'react';

interface StatusFilterProps {
  status: FilterType;
  onStatusChange: Dispatch<SetStateAction<FilterType>>;
}

export const StatusFilter = ({ status, onStatusChange }: StatusFilterProps) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: status === FilterType.All,
        })}
        data-cy="FilterLinkAll"
        onClick={event => {
          event.preventDefault();
          onStatusChange(FilterType.All);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: status === FilterType.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={event => {
          event.preventDefault();
          onStatusChange(FilterType.Active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: status === FilterType.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={event => {
          event.preventDefault();
          onStatusChange(FilterType.Completed);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
