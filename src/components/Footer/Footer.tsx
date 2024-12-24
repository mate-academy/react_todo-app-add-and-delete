import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../../types/Todo';
import { FilterBy, filterByValues } from '../../types/FilterBy';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  activeTodos: Todo[];
  currentFilter: FilterBy;
  setCurrentFilter: Dispatch<SetStateAction<FilterBy>>;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  currentFilter,
  setCurrentFilter,
  todos,
  activeTodos,
  handleClearCompleted,
}) => {
  const displayFilter = (filter: FilterBy) =>
    filter.charAt(0).toUpperCase() + filter.slice(1);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterByValues.map(filter => (
          <a
            key={filter}
            href={`#/${filter.toLowerCase()}`}
            data-cy={`FilterLink${displayFilter(filter)}`}
            className={classNames('filter__link', {
              selected: currentFilter === filter,
            })}
            onClick={() => {
              setCurrentFilter(filter);
            }}
          >
            {displayFilter(filter)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
