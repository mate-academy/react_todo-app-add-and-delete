import React from 'react';
import classNames from 'classnames';
import { FilterOptions } from '../types/FilterOptions';

interface FooterItemProps {
  notCompletedTodos: { length: number };
  setFilter: (filter: FilterOptions) => void;
  filter: string;
  handleClearCompleted: () => void;
  completedTodos: { length: number };
}

export const FooterItem: React.FC<FooterItemProps> = ({
  notCompletedTodos,
  setFilter,
  filter,
  handleClearCompleted,
  completedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodos.length} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterOptions).map(option => (
          <a
            key={option}
            href={`#/${option}`}
            className={classNames('filter__link', {
              selected: filter === option,
            })}
            data-cy={`FilterLink${option.charAt(0).toUpperCase() + option.slice(1)}`}
            onClick={() => setFilter(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
