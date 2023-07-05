import React from 'react';
import cn from 'classnames';
import { FilterBy } from '../../types/FilterBy';

type Props = {
  setTodosFilter: (status: FilterBy) => void;
  todosFilter: FilterBy;
  activeTodosNumber: number;
  completedTodosNumber: number;
};

export const Footer: React.FC<Props> = ({
  setTodosFilter,
  todosFilter,
  activeTodosNumber,
  completedTodosNumber,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosNumber} items left`}
      </span>

      <nav className="filter">
        {Object.entries(FilterBy).map(([key, value]) => (
          <a
            key={key}
            href={`#${value}`}
            className={cn('filter__link',
              { selected: todosFilter === value })}
            onClick={() => setTodosFilter(value)}
          >
            {key}
          </a>
        ))}
      </nav>

      {completedTodosNumber > 0
        && (
          <button type="button" className="todoapp__clear-completed">
            Clear completed
          </button>
        )}
    </footer>
  );
};
