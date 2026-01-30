import React from 'react';
import cn from 'classnames';
import { FilterStatus } from '../types/FilterStatus';
import { Todo } from '../types/Todo';

type Props = {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  todos: Todo[];
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  currentFilter,
  onFilterChange,
  todos,
  onClearCompleted,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const filterOpions = [
    FilterStatus.All,
    FilterStatus.Active,
    FilterStatus.Completed,
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOpions.map(filter => (
          <a
            key={filter}
            href={`#/${filter.toLowerCase()}`}
            data-cy={`FilterLink${filter}`}
            className={cn('filter__link', {
              selected: currentFilter === filter,
            })}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
