import React from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';

interface Props {
  activeTodosCount: number;
  completedTodosCount: number;
  filter: Status;
  setFilter: (status: Status) => void;
  handleClearCompleted: () => void;
}

const filterOptions = [
  { status: Status.All, label: 'All', href: '#/', dataCy: 'FilterLinkAll' },
  {
    status: Status.Active,
    label: 'Active',
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    status: Status.Completed,
    label: 'Completed',
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  completedTodosCount,
  filter,
  setFilter,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map(({ status, label, href, dataCy }) => (
          <a
            key={status}
            href={href}
            className={classNames('filter__link', {
              selected: filter === status,
            })}
            data-cy={dataCy}
            onClick={() => setFilter(status)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
