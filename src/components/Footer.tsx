import React from 'react';
import cn from 'classnames';
import { FilterType } from '../types/FilterType';
import { FilterTypeValues } from '../types/FilterType';

interface Props {
  filter: FilterTypeValues;
  setFilter: (filter: FilterTypeValues) => void;
  countOfActiveTodos: number;
  deleteCompletedTodos: () => void;
  hasCompletedTodos: boolean;
}

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  countOfActiveTodos,
  deleteCompletedTodos,
  hasCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countOfActiveTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(FilterType).map(([text, value]) => (
          <a
            key={value}
            href="#/"
            className={cn('filter__link', {
              selected: filter === value,
            })}
            data-cy={`FilterLink${text}`}
            onClick={() => setFilter(value)}
          >
            {text}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => deleteCompletedTodos()}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
