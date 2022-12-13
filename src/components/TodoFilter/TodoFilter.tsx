import React from 'react';
import classNames from 'classnames';

import { Status } from '../../types/Status';

interface Props {
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
}

export const TodoFilter: React.FC<Props> = (props) => {
  const { status, setStatus } = props;

  const {
    All,
    Active,
    Completed,
  } = Status;

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          {
            selected: status === All,
          },
        )}
        onClick={
          () => setStatus(All)
        }
      >
        {All}
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          {
            selected: status === Active,
          },
        )}
        onClick={
          () => setStatus(Active)
        }
      >
        {Active}
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          {
            selected: status === Completed,
          },
        )}
        onClick={
          () => setStatus(Completed)
        }
      >
        {Completed}
      </a>
    </nav>
  );
};
