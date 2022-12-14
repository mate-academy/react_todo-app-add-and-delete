import classNames from 'classnames';
import React from 'react';
import { StatusToFilter } from '../../types/StatusToFilter';

interface Props {
  filterStatus: string,
  onFilterStatusChange: (newStatus: StatusToFilter) => void,
}

export const TodoFilter: React.FC<Props> = React.memo(({
  filterStatus, onFilterStatusChange,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filterStatus === StatusToFilter.All },
        )}
        onClick={() => onFilterStatusChange(StatusToFilter.All)}
      >
        {StatusToFilter.All}
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filterStatus === StatusToFilter.Active },
        )}
        onClick={() => onFilterStatusChange(StatusToFilter.Active)}
      >
        {StatusToFilter.Active}
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filterStatus === StatusToFilter.Completed },
        )}
        onClick={() => onFilterStatusChange(StatusToFilter.Completed)}
      >
        {StatusToFilter.Completed}
      </a>
    </nav>
  );
});
