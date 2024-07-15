import React from 'react';
import classNames from 'classnames';
import { Status } from '../separate/Status';

export type Props = {
  filter: Status;
  statusChange: (newStatus: Status) => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  statusChange = () => {},
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(Status).map(value => (
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === value,
          })}
          data-cy={`FilterLink${value}`}
          onClick={() => statusChange(value)}
          key={value}
        >
          {value}
        </a>
      ))}
    </nav>
  );
};
