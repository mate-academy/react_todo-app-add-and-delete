import React from 'react';
import classNames from 'classnames';
import { Status } from '../../types/Status';

type Props = {
  status: Status,
  setStatus: (status: Status) => void,
};

export const Filter: React.FC<Props> = ({ status, setStatus }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: status === Status.All,
        })}
        onClick={() => setStatus(Status.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: status === Status.Active,
        })}
        onClick={() => setStatus(Status.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: status === Status.Completed,
        })}
        onClick={() => setStatus(Status.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
