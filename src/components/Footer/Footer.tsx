import cn from 'classnames';
import React, { useMemo } from 'react';
import { FilterStatus } from '../../types/Filter';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  onClearCompleted: () => void;
}
export const Footer: React.FC<Props> = React.memo(
  ({ todos, filter, onFilterChange, onClearCompleted }) => {
    const activeCount = useMemo(
      () => todos.filter(todo => !todo.completed).length,
      [todos],
    );
    const hasCompleted = useMemo(
      () => todos.some(todo => todo.completed),
      [todos],
    );

    const filterOptions: FilterStatus[] = ['all', 'active', 'completed'];

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeCount} item{activeCount !== 1 ? 's' : ''} left
        </span>

        <nav className="filter" data-cy="Filter">
          {filterOptions.map(oneFilter => (
            <a
              key={oneFilter}
              href={`#/${oneFilter === 'all' ? '' : oneFilter}`}
              className={cn('filter__link', {
                selected: filter === oneFilter,
              })}
              data-cy={`FilterLink${oneFilter.charAt(0).toUpperCase() + oneFilter.slice(1)}`}
              onClick={() => onFilterChange(oneFilter)}
            >
              {oneFilter.charAt(0).toUpperCase() + oneFilter.slice(1)}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={!hasCompleted}
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);

Footer.displayName = 'Footer';
