import React from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/Filter';

interface Props {
  filter: FilterType;
  activeTodosCount: number;
  completedTodosCount: number;
  setFilter: (params: FilterType) => void;
  clearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  filter,
  activeTodosCount,
  completedTodosCount,
  setFilter,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(type => (
          <a
            key={type}
            href={type === FilterType.All ? '#/' : `#/${type}`}
            className={cn('filter__link', { selected: filter === type })}
            data-cy={`FilterLink${type.charAt(0).toUpperCase() + type.slice(1)}`}
            onClick={() => setFilter(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
