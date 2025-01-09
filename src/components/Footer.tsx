import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoFilter } from '../types/Filter';

type Props = {
  notCompletedTodosCount: Todo[];
  filter: TodoFilter;
  hasCompletedTodos: boolean;
  setFilter: (filter: TodoFilter) => void;
  onClearCompleted: () => void;
};

const filters = [
  { type: TodoFilter.All, label: 'All', href: '#/' },
  { type: TodoFilter.Active, label: 'Active', href: '#/active' },
  { type: TodoFilter.Completed, label: 'Completed', href: '#/completed' },
];

export const Footer: React.FC<Props> = ({
  notCompletedTodosCount,
  filter,
  hasCompletedTodos,
  setFilter,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodosCount.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(({ type, label, href }) => (
          <a
            key={type}
            href={href}
            className={classNames('filter__link', {
              selected: filter === type,
            })}
            data-cy={`FilterLink${label}`}
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
        disabled={!hasCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
