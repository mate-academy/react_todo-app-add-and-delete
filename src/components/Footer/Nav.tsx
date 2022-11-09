import React, { useContext } from 'react';
import classNames from 'classnames';
import { Status } from '../../enums/Status';
import { StatusContext } from '../StatusContext';

export const Nav: React.FC = () => {
  const { selectStatus, setSelectStatus } = useContext(StatusContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: selectStatus === Status.All },
        )}
        onClick={() => setSelectStatus(Status.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: selectStatus === Status.Active },
        )}
        onClick={() => setSelectStatus(Status.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: selectStatus === Status.Completed },
        )}
        onClick={() => setSelectStatus(Status.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
