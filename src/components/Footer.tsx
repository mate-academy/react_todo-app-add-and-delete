import React from 'react';
import classNames from 'classnames';
import { StatusFilter } from '../types/enums';

interface Props {
  activeCount: number;
  completedCount: number;
  filter: StatusFilter;
  setFilter: (filter: StatusFilter) => void;
  clearCompleted: () => void;
}

const filterLinks = [
  {
    label: 'All',
    value: StatusFilter.All,
    href: '#/',
    dataCy: 'FilterLinkAll',
  },
  {
    label: 'Active',
    value: StatusFilter.Active,
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    label: 'Completed',
    value: StatusFilter.Completed,
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const Footer: React.FC<Props> = ({
  activeCount,
  completedCount,
  filter,
  setFilter,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks.map(({ label, value, href, dataCy }) => (
          <a
            key={value}
            href={href}
            className={classNames('filter__link', {
              selected: filter === value,
            })}
            data-cy={dataCy}
            onClick={() => setFilter(value)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={completedCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
