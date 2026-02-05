import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../../types/ui';

type Props = {
  countActive: number;
  todosLength: number;
  current: FilterStatus;
  setFilter: (f: FilterStatus) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
};

const FILTERS: Array<{
  status: FilterStatus;
  label: string;
  href: string;
  dataCy: string;
}> = [
  {
    status: FilterStatus.All,
    label: 'All',
    href: '#/',
    dataCy: 'FilterLinkAll',
  },
  {
    status: FilterStatus.Active,
    label: 'Active',
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    status: FilterStatus.Completed,
    label: 'Completed',
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const Footer: React.FC<Props> = ({
  countActive,
  todosLength,
  current,
  setFilter,
  hasCompleted,
  onClearCompleted,
}) => {
  if (!todosLength) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countActive} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(status => {
          const filter = FILTERS.find(f => f.status === status);

          if (!filter) {
            return null;
          }

          return (
            <a
              key={filter.status}
              href={filter.href}
              className={classNames('filter__link', {
                selected: current === filter.status,
              })}
              data-cy={filter.dataCy}
              onClick={() => setFilter(filter.status)}
            >
              {filter.label}
            </a>
          );
        })}
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

export default Footer;
