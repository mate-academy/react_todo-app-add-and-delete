import React from 'react';

enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  completedTodos: number;
  notCompletedTodos: number;
  filter: string;
  setFilter: (filter: string) => void;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  completedTodos,
  notCompletedTodos,
  filter,
  setFilter,
  handleClearCompleted,
}) => {
  const filterLinks = [
    { key: Filter.All, label: 'All', href: '#/' },
    { key: Filter.Active, label: 'Active', href: '#/active' },
    { key: Filter.Completed, label: 'Completed', href: '#/completed' },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks.map(({ key, label, href }) => (
          <a
            key={key}
            href={href}
            className={`filter__link ${filter === key ? `selected` : ``}`}
            data-cy={`FilterLink${label}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
