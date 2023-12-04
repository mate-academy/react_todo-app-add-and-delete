import React from 'react';
import classNames from 'classnames';
import { useTodo } from '../../hooks/useTodo';
import { Status } from '../../types/Status';

export const TodoFilter: React.FC = () => {
  const { filter, setFilter } = useTodo();

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    const target = event.target as HTMLElement;
    const newFilter = target.innerText;

    setFilter(newFilter as Status);
  };

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === Status.ALL,
        })}
        onClick={handleClick}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === Status.ACTIVE,
        })}
        onClick={handleClick}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === Status.COMPLETED,
        })}
        onClick={handleClick}
      >
        Completed
      </a>
    </nav>
  );
};
