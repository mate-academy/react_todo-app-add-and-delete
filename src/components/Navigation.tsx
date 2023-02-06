import React from 'react';
import classnames from 'classnames';

type Props = {
  changeStatus: React.Dispatch<React.SetStateAction<string>>,
  status: string,
};

export const Navigation: React.FC<Props> = ({ changeStatus, status }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classnames({
          filter__link: true,
          selected: status === 'All',
        })}
        onClick={(event) => {
          changeStatus(event.currentTarget.innerHTML);
        }}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classnames({
          filter__link: true,
          selected: status === 'Active',
        })}
        onClick={(event) => {
          changeStatus(event.currentTarget.innerHTML);
        }}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classnames({
          filter__link: true,
          selected: status === 'Completed',
        })}
        onClick={(event) => {
          changeStatus(event.currentTarget.innerHTML);
        }}
      >
        Completed
      </a>

    </nav>
  );
};
