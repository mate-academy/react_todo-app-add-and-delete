import React from 'react';
import { FilterType } from '../../types/FilterType';
import { useTodos } from '../../utils/TodoContext';
import { useClearCompleted } from '../../hooks/useClearCompleted';
import classNames from 'classnames';

export const Footer: React.FC = () => {
  const { todos, filter, setFilter } = useTodos();
  const { handleClearCompleted } = useClearCompleted();

  if (!todos?.length) {
    return null;
  }

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.length - activeTodosCount;

  const filters = [
    { type: FilterType.All, label: 'All', cy: 'FilterLinkAll', href: '#/' },
    {
      type: FilterType.Active,
      label: 'Active',
      cy: 'FilterLinkActive',
      href: '#/active',
    },
    {
      type: FilterType.Completed,
      label: 'Completed',
      cy: 'FilterLinkCompleted',
      href: '#/completed',
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(({ type, label, cy, href }) => (
          <a
            key={type}
            href={href}
            className={classNames('filter__link', {
              selected: filter === type,
            })}
            data-cy={cy}
            onClick={() => setFilter(type)}
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
        onClick={handleClearCompleted} // Wywołanie handleClearCompleted
      >
        Clear completed
      </button>
    </footer>
  );
};
