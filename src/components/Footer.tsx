import React from 'react';
import { Filter } from '../types/Filter';
import classNames from 'classnames';

interface FooterProps {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  todosCount: number;
  clearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  filter,
  setFilter,
  todosCount,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(value => (
          <a
          key={value}
          href={`#/${value}`}
          className={classNames('filter__link', { selected: filter === value })}
          onClick={() => setFilter(value)}
          data-cy={`FilterLink${value.charAt(0).toUpperCase() + value.slice(1)}`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={todosCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
