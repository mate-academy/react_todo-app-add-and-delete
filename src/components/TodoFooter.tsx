import React from 'react';
import { Filter } from '../types/Filter';
import classNames from 'classnames';

type Props = {
  activeTodos: number;
  completedTodos: boolean;
  filter: Filter;
  onFilterChange: (status: Filter) => void;
  onDeleteCompletedTodos: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodos,
  completedTodos,
  filter,
  onFilterChange,
  onDeleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(option => (
          <a
            key={option}
            href={`#/${option === Filter.All ? '' : option}`}
            className={classNames('filter__link', {
              selected: filter === option,
            })}
            data-cy={`FilterLink${option[0].toUpperCase() + option.slice(1)}`}
            onClick={() => onFilterChange(option)}
          >
            {option[0].toUpperCase() + option.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos}
        onClick={onDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
