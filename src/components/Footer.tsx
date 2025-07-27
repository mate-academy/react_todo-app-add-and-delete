import React from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

type Props = {
  todos: Todo[];
  statusFilter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
  completedCount: number;
};

export const Footer: React.FC<Props> = ({
  todos,
  statusFilter,
  onFilterChange,
  onClearCompleted,
  completedCount,
}) => {
  const notCompletedTodos = todos.filter(todo => !todo.completed);

  const filterLinks = [
    {
      name: 'All',
      href: '#/',
      dataCy: 'FilterLinkAll',
      value: Filter.All,
    },
    {
      name: 'Active',
      href: '#/active',
      dataCy: 'FilterLinkActive',
      value: Filter.Active,
    },
    {
      name: 'Completed',
      href: '#/completed',
      dataCy: 'FilterLinkCompleted',
      value: Filter.Completed,
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${notCompletedTodos.length} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterLinks.map(({ name, href, dataCy, value }) => (
          <a
            key={value}
            href={href}
            className={`filter__link ${statusFilter === value ? 'selected' : ''}`}
            data-cy={dataCy}
            onClick={() => onFilterChange(value)}
          >
            {name}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
