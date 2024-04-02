import React from 'react';
import { Status } from '../types/Status';
import classNames from 'classnames';

interface Props {
  status: Status;
  setStatus: (value: Status) => void;
}

export const FilterTodos: React.FC<Props> = ({ status, setStatus }) => {
  return (
    <>
      {Object.values(Status).map(value => (
        <a
          key={value}
          href={`#${value}`}
          className={classNames('filter__link', { selected: status === value })}
          onClick={() => setStatus(value)}
          data-cy={`FilterLink${value}`}
        >
          {value}
        </a>
      ))}
    </>
  );
};
