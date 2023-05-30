import React from 'react';
import cn from 'classnames';
import { StatusTypes } from '../../types/StatusTypes';

type Props = {
  selectedStatus: StatusTypes,
  setStatus: React.Dispatch<React.SetStateAction<StatusTypes>>,
  itemsLeftCount: number,
};

export const Footer: React.FC<Props> = ({
  selectedStatus,
  setStatus,
  itemsLeftCount,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeftCount} `}
        items left
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={
            cn(
              'filter__link',
              { selected: selectedStatus === StatusTypes.all },
            )
          }
          onClick={() => (setStatus(StatusTypes.all))}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            cn(
              'filter__link',
              { selected: selectedStatus === StatusTypes.active },
            )
          }
          onClick={() => (setStatus(StatusTypes.active))}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            cn(
              'filter__link',
              { selected: selectedStatus === StatusTypes.completed },
            )
          }
          onClick={() => (setStatus(StatusTypes.completed))}
        >
          Completed
        </a>
      </nav>

      <button type="button" className="todoapp__clear-completed">
        Clear completed
      </button>
    </footer>
  );
};
