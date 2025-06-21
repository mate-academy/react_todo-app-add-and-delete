import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { StatusFilter } from '../types/StatusFilter';

type Props = {
  todos: Todo[];
  filter: StatusFilter;
  setFilter: (filter: StatusFilter) => void;
  handleClearCompleted: () => void;
};

const FILTERS = [
  {
    label: 'All',
    value: StatusFilter.All,
    dataCy: 'FilterLinkAll',
    href: '#/',
  },
  {
    label: 'Active',
    value: StatusFilter.Active,
    dataCy: 'FilterLinkActive',
    href: '#/active',
  },
  {
    label: 'Completed',
    value: StatusFilter.Completed,
    dataCy: 'FilterLinkCompleted',
    href: '#/completed',
  },
];

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  handleClearCompleted,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTERS.map(({ label, value, dataCy, href }) => (
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
        onClick={handleClearCompleted}
        disabled={completedCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
