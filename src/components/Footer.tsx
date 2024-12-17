import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  todos: Todo[];
  onFilter: React.Dispatch<React.SetStateAction<string>>;
  filter: string;
  handleDeleteAllCompleted: (currentsTodo: number[]) => void;
};

const filterOptions = {
  [Filter.All]: { label: Filter.All, href: '#/' },
  [Filter.Active]: { label: Filter.Active, href: '#/active' },
  [Filter.Completed]: { label: Filter.Completed, href: '#/completed' },
};

export const Footer: React.FC<Props> = ({
  todos,
  onFilter,
  filter,
  handleDeleteAllCompleted,
}) => {
  const totalItemsCount = todos.reduce(
    (count, todo) => (todo.completed ? count : count + 1),
    0,
  );

  const hasCompletedTodos = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {totalItemsCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(filterOptions).map(([key, { label, href }]) => {
          const isSelected = filter === key;

          return (
            <a
              key={key}
              href={href}
              className={cn('filter__link', { selected: isSelected })}
              data-cy={`FilterLink${label}`}
              onClick={() => onFilter(key)}
            >
              {label}
            </a>
          );
        })}
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
