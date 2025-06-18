import cn from 'classnames';
import React from 'react';
import { FilterParams } from '../../types/FilterParams';

interface Props {
  handleClearCompleted: () => void;
  setFilterParam: (value: FilterParams) => void;
  filterParam: FilterParams;
  isCompletedTodos: boolean;
  activeTodos: number;
}

const filters = [
  { value: FilterParams.All, label: 'All' },
  { value: FilterParams.Active, label: 'Active' },
  { value: FilterParams.Completed, label: 'Completed' },
];

export const AppFooter: React.FC<Props> = ({
  handleClearCompleted,
  setFilterParam,
  filterParam,
  isCompletedTodos,
  activeTodos,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeTodos} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      {filters.map(filter => {
        const { value, label } = filter;

        return (
          <a
            key={value}
            href="#/"
            className={cn('filter__link', {
              selected: filterParam === value,
            })}
            data-cy={`FilterLink${label}`}
            onClick={() => setFilterParam(value)}
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
      disabled={!isCompletedTodos}
      onClick={() => handleClearCompleted()}
    >
      Clear completed
    </button>
  </footer>
);
