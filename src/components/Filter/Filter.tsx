import React, { useCallback } from 'react';
import classNames from 'classnames';
import { Status } from '../../types/Status';

interface Props {
  currentStatus: Status;
  setStatus: (newStatus: Status) => void;
}

export const Filter: React.FC<Props> = React.memo(({
  currentStatus,
  setStatus,
}) => {
  const handleFilterAll = useCallback(() => {
    if (currentStatus !== Status.all) {
      setStatus(Status.all);
    }
  }, [currentStatus, setStatus]);

  const handleFilterActive = useCallback(() => {
    if (currentStatus !== Status.active) {
      setStatus(Status.active);
    }
  }, [currentStatus, setStatus]);

  const handleFilterCompleted = useCallback(() => {
    if (currentStatus !== Status.completed) {
      setStatus(Status.completed);
    }
  }, [currentStatus, setStatus]);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: currentStatus === Status.all,
        })}
        data-cy="FilterLinkAll"
        onClick={handleFilterAll}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: currentStatus === Status.active,
        })}
        data-cy="FilterLinkActive"
        onClick={handleFilterActive}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: currentStatus === Status.completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={handleFilterCompleted}
      >
        Completed
      </a>
    </nav>
  );
});
