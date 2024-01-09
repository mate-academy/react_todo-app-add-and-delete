import React from 'react';
import cn from 'classnames';

import { useTodos } from '../context/TodoProvider';
import { Filters } from '../types';

export const Footer: React.FC = () => {
  const {
    todos,
    filterBy,
    setFilterBy,
    deleteTodo,
  } = useTodos();

  const activeCountItems = todos
    .filter(todo => !todo.completed).length;

  const isTodosCompleted = todos
    .some(todo => todo.completed);

  const handleClearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => deleteTodo(todo.id));
  };

  const filterOptions = [
    { label: 'All', status: Filters.All },
    { label: 'Active', status: Filters.Active },
    { label: 'Completed', status: Filters.Completed },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCountItems} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterOptions.map(({ label, status }) => (
          <a
            key={status}
            href={`#/${status.toLowerCase()}`}
            className={cn(
              'filter__link', {
                selected: filterBy === status,
              },
            )}
            data-cy={`FilterLink${status}`}
            onClick={() => setFilterBy(status)}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isTodosCompleted}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
