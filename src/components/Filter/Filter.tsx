import classNames from 'classnames';
import React from 'react';

type Props = {
  status: string,
  setStatus: (status: string) => void,
};

export const Filter: React.FC<Props> = ({ status, setStatus }) => (
  <nav className="filter" data-cy="Filter">
    <a
      data-cy="FilterLinkAll"
      href="#/"
      className={classNames(
        'filter__link',
        {
          selected: status === 'all',
        },
      )}
      onClick={() => setStatus('all')}
    >
      All
    </a>

    <a
      data-cy="FilterLinkActive"
      href="#/active"
      className={classNames(
        'filter__link',
        {
          selected: status === 'active',
        },
      )}
      onClick={() => setStatus('active')}
    >
      Active
    </a>
    <a
      data-cy="FilterLinkCompleted"
      href="#/completed"
      className={classNames(
        'filter__link',
        {
          selected: status === 'completed',
        },
      )}
      onClick={() => setStatus('completed')}
    >
      Completed
    </a>
  </nav>
);
