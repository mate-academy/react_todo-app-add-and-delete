import React from 'react';
import cn from 'classnames';
import { Filters, Todo } from '../../types';

interface Props {
  todos: Todo[];
  isDelCompleted: boolean;
  selectedFilter: Filters;
  onChangeFilter: (fil: Filters) => void;
  onDeleteCompleted: () => void;
}

export const TodoFooter: React.FC<Props> = ({
  todos,
  isDelCompleted,
  selectedFilter,
  onChangeFilter,
  onDeleteCompleted,
}) => {
  const allFilters = [Filters.All, Filters.Active, Filters.Completed];

  const activeTodos = todos.reduce(
    (acc, curr) => (!curr.completed ? acc + 1 : acc),
    0,
  );

  const isCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {allFilters.map(filter => (
          <a
            key={filter}
            href={`#/${filter !== Filters.All ? filter.toLowerCase() : ''}`}
            className={cn('filter__link', {
              selected: filter === selectedFilter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => onChangeFilter(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isDelCompleted || !isCompleted}
        style={{ visibility: !isCompleted ? 'hidden' : 'visible' }}
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
