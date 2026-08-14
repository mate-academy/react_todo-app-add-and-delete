import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { Status } from '../../types/Status';

type Props = {
  todos: Todo[];
  status: Status;
  onStatusChange: (status: Status) => void;
  onClearCompleted: () => void;
};

const filterOptions = [
  {
    status: Status.All,
    label: 'All',
    href: '#/',
    dataCy: 'FilterLinkAll',
  },
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

export const Footer: React.FC<Props> = ({
  todos,
  status,
  onStatusChange,
  onClearCompleted,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterOptions.map(option => (
          <a
            key={option.status}
            href={option.href}
            className={classNames('filter__link', {
              selected: status === option.status,
            })}
            onClick={() => onStatusChange(option.status)}
            data-cy={option.dataCy}
          >
            {option.label}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={() => onClearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
