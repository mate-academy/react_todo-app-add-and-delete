import cn from 'classnames';
import React from 'react';
import { Status } from '../../types/Status';

type Props = {
  filteredType: Status,
  setFilteredType: (newStatus: Status) => void;
};

export const TodosFilter: React.FC<Props> = ({
  filteredType, setFilteredType,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link',
          { selected: filteredType === Status.All })}
        data-cy="FilterLinkAll"
        onClick={() => setFilteredType(Status.All)}
      >
        {Status.All}
      </a>

      <a
        href="#/active"
        className={cn('filter__link',
          { selected: filteredType === Status.Active })}
        data-cy="FilterLinkActive"
        onClick={() => setFilteredType(Status.Active)}
      >
        {Status.Active}
      </a>

      <a
        href="#/completed"
        className={cn('filter__link',
          { selected: filteredType === Status.Completed })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilteredType(Status.Completed)}
      >
        {Status.Completed}
      </a>
    </nav>
  );
};
