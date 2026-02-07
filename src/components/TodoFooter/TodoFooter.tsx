import './TodoFooter.scss';

import React from 'react';
import classNames from 'classnames';
import { FilterType, FilterLink } from '../../types/FilterType';

interface Props {
  activeTodos: number;
  completedTodos: number;
  filters: FilterLink[];
  selectedFilter: FilterType;
  onFilter: (value: FilterType) => void;
  onClear: () => void;
}

export const TodoFooter: React.FC<Props> = ({
  activeTodos,
  completedTodos,
  filters,
  selectedFilter,
  onFilter,
  onClear,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(({ name, value, href }) => (
          <a
            key={value}
            href={href}
            data-cy={`FilterLink${name}`}
            className={classNames('filter__link', {
              selected: selectedFilter === value,
            })}
            onClick={() => onFilter(value)}
          >
            {name}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos === 0}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
