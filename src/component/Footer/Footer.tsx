import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/enums';

interface Props {
  todos: Todo[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  onClearCompleted,
}) => {
  const activeCount = todos.filter(t => !t.completed).length;
  const hasCompleted = todos.some(t => t.completed);

  const filterLinks = [
    { type: FilterType.All, label: 'All', href: '#/', testId: 'FilterLinkAll' },
    {
      type: FilterType.Active,
      label: 'Active',
      href: '#/active',
      testId: 'FilterLinkActive',
    },
    {
      type: FilterType.Completed,
      label: 'Completed',
      href: '#/completed',
      testId: 'FilterLinkCompleted',
    },
  ];

  if (todos.length === 0) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks.map(link => (
          <a
            key={link.type}
            href={link.href}
            className={classNames('filter__link', {
              selected: filter === link.type,
            })}
            data-cy={link.testId}
            onClick={() => setFilter(link.type)}
          >
            {link.label}
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
