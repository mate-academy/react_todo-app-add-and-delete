import React from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

type FooterProps = {
  activeTodosQuantity: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  totalTodos: number;
  clearCompletedTodos: () => void;
};

export const Footer: React.FC<FooterProps> = ({
  activeTodosQuantity,
  filter,
  setFilter,
  totalTodos,
  clearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosQuantity} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterValue => (
          <a
            key={filterValue}
            href={`#/${filterValue === Filter.All ? '' : filterValue.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: filter === filterValue,
            })}
            data-cy={`FilterLink${filterValue}`}
            onClick={() => setFilter(filterValue)}
          >
            {filterValue}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={totalTodos === activeTodosQuantity}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
