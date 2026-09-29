import React from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  activeCount: number;
  hasCompleted: boolean;
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
};

const FILTER_LINKS = [
  { value: Filter.All, title: 'All', href: '#/', dataCy: 'FilterLinkAll' },
  {
    value: Filter.Active,
    title: 'Active',
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    value: Filter.Completed,
    title: 'Completed',
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const Footer: React.FC<Props> = ({
  activeCount,
  hasCompleted,
  filter,
  onFilterChange,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeCount} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      {FILTER_LINKS.map(({ value, title, href, dataCy }) => (
        <a
          key={value}
          href={href}
          className={classNames('filter__link', {
            selected: filter === value,
          })}
          data-cy={dataCy}
          onClick={() => onFilterChange(value)}
        >
          {title}
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
