import React, { useState } from 'react';
import classnames from 'classnames';

type Props = {
  changeFunction: (event: React.MouseEvent) => void
};

export const Navigation: React.FC<Props> = ({ changeFunction }) => {
  const [active, setActive] = useState('All');

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classnames({
          filter__link: true,
          selected: active === 'All',
        })}
        onClick={(event) => {
          changeFunction(event);
          setActive(event.currentTarget.innerHTML);
        }}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classnames({
          filter__link: true,
          selected: active === 'Active',
        })}
        onClick={(event) => {
          changeFunction(event);
          setActive(event.currentTarget.innerHTML);
        }}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classnames({
          filter__link: true,
          selected: active === 'Completed',
        })}
        onClick={(event) => {
          changeFunction(event);
          setActive(event.currentTarget.innerHTML);
        }}
      >
        Completed
      </a>

    </nav>
  );
};
