import React from 'react';
import { Status } from '../types/Status';

type Props = {
  activeCount: number;
  hasCompleted: boolean;
  status: Status;
  onStatusChange: (status: Status) => void;
  onClearCompleted: () => void;
};

const FILTERS = [
  { status: Status.All, title: 'All', href: '#/', dataCy: 'FilterLinkAll' },
  {
    status: Status.Active,
    title: 'Active',
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    status: Status.Completed,
    title: 'Completed',
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const Footer: React.FC<Props> = ({
  activeCount,
  hasCompleted,
  status,
  onStatusChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTERS.map(filter => (
          <a
            key={filter.status}
            href={filter.href}
            className={
              status === filter.status
                ? 'filter__link selected'
                : 'filter__link'
            }
            data-cy={filter.dataCy}
            onClick={() => onStatusChange(filter.status)}
          >
            {filter.title}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
