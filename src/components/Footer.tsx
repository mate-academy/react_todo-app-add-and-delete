import classNames from 'classnames';
import React from 'react';

import { FILTER, FilterStatus } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filterBy: FilterStatus;
  onFilterChange: (newFilter: FilterStatus) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  onFilterChange,
  onClearCompleted,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FILTER).map(option => (
          <a
            key={option}
            href={`#/${option === FILTER.ALL ? '' : option}`}
            className={classNames('filter__link', {
              selected: filterBy === option,
            })}
            data-cy={`FilterLink${option[0].toUpperCase() + option.slice(1)}`}
            onClick={() => onFilterChange(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
