import React from 'react';
import { SortType } from '../../types/SortType';
import cn from 'classnames';

interface Props {
  todoAmount: number;
  completedAmount: number;
  sortType: SortType;
  onSortChange: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    sortType: SortType,
  ) => void;
  handleCleanCompleted: () => void;
}

export const TodoFooter: React.FC<Props> = ({
  todoAmount,
  completedAmount,
  sortType,
  onSortChange,
  handleCleanCompleted,
}) => {
  interface Link {
    key: SortType;
    label: string;
    cy: string;
  }
  const links: Link[] = [
    { key: 'all', label: 'All', cy: 'FilterLinkAll' },
    { key: 'active', label: 'Active', cy: 'FilterLinkActive' },
    { key: 'completed', label: 'Completed', cy: 'FilterLinkCompleted' },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todoAmount} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {links.map(link => (
          <a
            href=""
            className={cn('filter__link', { selected: sortType === link.key })}
            data-cy={link.cy}
            onClick={event => onSortChange(event, link.key)}
            key={link.key}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleCleanCompleted}
        disabled={completedAmount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
