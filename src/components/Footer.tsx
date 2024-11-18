import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  onFilter: React.Dispatch<React.SetStateAction<string>>;
  filter: string;
  handleDeleteAllCompleted: (currentsTodo: number[]) => void;
};

enum Filter {
  All = 'All',
  Active = 'active',
  Completed = 'completed',
}

const filterOptions = {
  [Filter.All]: { label: 'All', href: '#/' },
  [Filter.Active]: { label: 'Active', href: '#/active' },
  [Filter.Completed]: { label: 'Completed', href: '#/completed' },
};

export const Footer: React.FC<Props> = ({
  todos,
  onFilter,
  filter,
  handleDeleteAllCompleted,
}) => {
  const totalItemsCount = todos.filter(todo => !todo.completed).length;

  const hasCompletedTodos = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {totalItemsCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterKey => (
          <a
            key={filterKey}
            href={filterOptions[filterKey as Filter].href}
            className={cn('filter__link', { selected: filter === filterKey })}
            data-cy={`FilterLink${filterOptions[filterKey as Filter].label}`}
            onClick={() => onFilter(filterKey)}
          >
            {filterOptions[filterKey as Filter].label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos.length}
        onClick={() => handleDeleteAllCompleted(hasCompletedTodos)}
      >
        Clear completed
      </button>
    </footer>
  );
};
