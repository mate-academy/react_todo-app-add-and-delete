import React from 'react';
import cn from 'classnames';

type Props = {
  selectedStatus: string,
  onHandleStatus: (event: React.MouseEvent<HTMLAnchorElement>) => void,
  itemsLeftCount: number,
};

export const Footer: React.FC<Props> = ({
  selectedStatus,
  onHandleStatus: onHanbleStatus,
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
              { selected: selectedStatus === 'all' },
            )
          }
          onClick={onHanbleStatus}
          type="all"
        >
          All
        </a>

        <a
          href="#/active"
          className={
            cn(
              'filter__link',
              { selected: selectedStatus === 'active' },
            )
          }
          onClick={onHanbleStatus}
          type="active"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            cn(
              'filter__link',
              { selected: selectedStatus === 'completed' },
            )
          }
          onClick={onHanbleStatus}
          type="completed"
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
