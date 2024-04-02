import React from 'react';
import { Status } from '../types/Status';
import classNames from 'classnames';
import { useTodosContext } from '../context/TodoContext';

export const FilterTodos: React.FC = () => {
  const { status, setStatus } = useTodosContext();

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
