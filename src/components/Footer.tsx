import React from 'react';
import { FilterBy } from '../types/FilterBy';
import { Todo } from '../types/Todo';

interface FilterLink {
  label: string;
  value: FilterBy;
  href: string;
}

interface Props {
  todos: Todo[];
  filter: FilterBy;
  setFilter: (filter: FilterBy) => void;
  hasCompleted: boolean;
  clearCompleted: () => void;
  filterLinks: FilterLink[];
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  hasCompleted,
  clearCompleted,
  filterLinks,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks.map(link => (
          <a
            key={link.value}
            href={link.href}
            className={`filter__link ${filter === link.value ? 'selected' : ''}`}
            data-cy={`FilterLink${link.label}`}
            onClick={() => setFilter(link.value)}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        style={{ visibility: hasCompleted ? 'visible' : 'hidden' }}
        disabled={!hasCompleted}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
