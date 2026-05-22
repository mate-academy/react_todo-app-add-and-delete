import React from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

type Props = {
  todos: Todo[];
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
};

const filterLinks = [
  { type: FilterType.All, href: '#/', dataCy: 'FilterLinkAll', label: 'All' },
  {
    type: FilterType.Active,
    href: '#/active',
    dataCy: 'FilterLinkActive',
    label: 'Active',
  },
  {
    type: FilterType.Completed,
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
    label: 'Completed',
  },
];

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  if (todos.length === 0) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterLinks.map(link => (
          <a
            href={link.href}
            data-cy={link.dataCy}
            onClick={() => onFilterChange(link.type)}
            className={`filter__link ${filter === link.type ? 'selected' : ''}`}
            key={link.type}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => onClearCompleted()}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
