import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { FilterStatus } from '../types/types';

type Props = {
  todos: Todo[];
  filter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  const FILTERS = [
    {
      id: 'all' as FilterStatus,
      title: 'All',
      url: '#/',
      cy: 'FilterLinkAll',
    },
    {
      id: 'active' as FilterStatus,
      title: 'Active',
      url: '#/active',
      cy: 'FilterLinkActive',
    },
    {
      id: 'completed' as FilterStatus,
      title: 'Completed',
      url: '#/completed',
      cy: 'FilterLinkCompleted',
    },
  ];

  if (todos.length === 0) {
    return null;
  }

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.length - activeTodos;

  const handleFilterClick =
    (status: FilterStatus) => (event: React.MouseEvent) => {
      event.preventDefault();
      onFilterChange(status);
    };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTERS.map(({ id, title, url, cy }) => (
          <a
            key={id}
            href={url}
            className={cn('filter__link', { selected: filter === id })}
            data-cy={cy}
            onClick={handleFilterClick(id)}
          >
            {title}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
