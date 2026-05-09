import classNames from 'classnames';

import React from 'react';
import { Todo } from '../../types/todo';
import { Filter } from '../../utils/Filter';

type Props = {
  todos: Todo[];
  filter: Filter;
  onFilterChange: (
    event: React.MouseEvent<HTMLAnchorElement>,
    value: Filter,
  ) => void;
  clearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filter,
  onFilterChange,
  clearCompleted,
}) => {
  const filterLinks = [
    { label: 'All', value: Filter.All, href: '#/', dataCy: 'FilterLinkAll' },

    {
      label: 'Active',
      value: Filter.Active,
      href: '#/active',
      dataCy: 'FilterLinkActive',
    },

    {
      label: 'Completed',
      value: Filter.Completed,
      href: '#/completed',
      dataCy: 'FilterLinkCompleted',
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(t => !t.completed).length} items left
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
            onClick={event => onFilterChange(event, value)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(t => t.completed)}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
