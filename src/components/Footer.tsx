import React from 'react';

type Props = {
  todos: { completed: boolean }[];
  filter: 'all' | 'active' | 'completed';
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  handleClearCompleted: () => void;
};

enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

const filterLinks = [
  { type: Filter.All, label: 'All', href: '#/' },
  { type: Filter.Active, label: 'Active', href: '#/active' },
  { type: Filter.Completed, label: 'Completed', href: '#/completed' },
];

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  handleClearCompleted,
}) => {
  const itemsLeft = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} {itemsLeft === 1 ? 'item' : 'items'} left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterLinks.map(({ type, label, href }) => (
          <a
            key={type}
            href={href}
            className={`filter__link ${filter === type ? 'selected' : ''}`}
            data-cy={`FilterLink${label}`}
            onClick={e => {
              e.preventDefault();
              setFilter(type);
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
